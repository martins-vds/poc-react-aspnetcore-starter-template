import { AccountInfo } from "@azure/msal-browser";
import { msalConfig } from "../authConfig";

/**
 *  This method stores the claims to the sessionStorage in the browser to be used when acquiring a token
 * @param {String} claimsChallenge
 */
export const addClaimsToStorage = (
  claimsChallengeId: string,
  claims: string
) => {
  sessionStorage.setItem(claimsChallengeId, claims);
};

/**
 * This method return the claims from sessionStorage in the browser
 * @param {String} claimsChallengeId
 * @returns
 */
export const getClaimsFromStorage = (claimsChallengeId: string) => {
  return sessionStorage.getItem(claimsChallengeId);
};

/**
 * This method clears localStorage of any claims challenge entry
 * @param {Object} account
 */
export const clearStorage = (account: AccountInfo) => {
  for (const key in sessionStorage) {
    if (
      key.startsWith(
        `cc.${msalConfig.auth.clientId}.${account.idTokenClaims?.oid}`
      )
    )
      sessionStorage.removeItem(key);
  }
};
