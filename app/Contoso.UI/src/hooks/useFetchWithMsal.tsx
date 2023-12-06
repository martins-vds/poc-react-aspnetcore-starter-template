import { useState, useCallback } from "react";

import {
  AuthenticationResult,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { useAccount, useMsal } from "@azure/msal-react";

export enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Patch = "PATCH",
  Delete = "DELETE"
}

/**
 * Custom hook to call a web API using bearer token obtained from MSAL
 * @param {PopupRequest} msalRequest
 * @returns
 */
const useFetchWithMsal = () => {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState();

  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  /**
   * Execute a fetch request with the given options
   * @param {string} method: GET, POST, PUT, DELETE
   * @param {String} endpoint: The endpoint to call
   * @param {Object} data: The data to send to the endpoint, if any
   * @returns JSON response
   */
  const execute = async (method: HttpMethod, endpoint: string, scopes: Array<string>, body?: unknown, setRoles?: (roles: Array<string>) => void) => {
    setIsLoading(true);
    setError(undefined);

    let tokenResponse = {} as AuthenticationResult;
    const tokenRequest = {
      scopes: scopes,
      account: account || undefined,
    }

    // try and get a token silently. at times this might throw an InteractionRequiredAuthError - if so give the user a popup to click
    try {
      tokenResponse = await instance.acquireTokenSilent(tokenRequest);
    } catch (err) {
      console.warn("Unable to get a token silently", err);
      if (err instanceof InteractionRequiredAuthError) {
        tokenResponse = await instance.acquireTokenPopup(tokenRequest);
      }
    }

    // caller can pass a function to allow us to set the roles to use for RBAC
    if (setRoles) {
      const decodedToken = parseJwt(tokenResponse.accessToken);
      setRoles(decodedToken.roles);
    }

    // set the headers for auth + http method
    const opts: RequestInit = {
      mode: "cors",
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        'Content-Type': 'application/json',
      },
      method: method
    }

    // add a body if we're given one
    if (body) opts.body = JSON.stringify(body);

    try {
      const resp = await fetch(endpoint, opts);

      // if the response is ok, parse the body and return it
      if (resp.ok) {
        const json = await resp.json();
        setData(json);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setError(new Error(resp.statusText));
      }

    } catch (err: unknown) {
      setIsLoading(false);
      setError(err as Error);
    }
  };

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, [account, instance]), // to avoid infinite calls when inside a `useEffect`
  };
};

export default useFetchWithMsal;
