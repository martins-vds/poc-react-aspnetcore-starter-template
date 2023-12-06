#!/bin/bash
## USAGE  ./deploy-infra.sh <LOCATION> <RESOURCE GROUP> <DEPLOYMENT TEMPLATE> <APP NAME> <ENVIRONMENT> <B2C INSTANCE> <B2C CLIENT ID> <B2C DOMAIN> <B2C SIGNIN POLICY NAME> <B2C SIGNOUT CALLBACK PATH>
set -ex

location="$1"
resource_group="$2"
deployment_template="$3"
app="$4"
environment="$5"
b2c_instance="$6"
b2c_clientId="$7"
b2c_domain="$8"
b2c_signinPolicyName="$9"
b2c_signoutCallbackPath="${10}"


if [[ ! -f $deployment_template ]]; then
    echo "Deployment template file not found: $deployment_template"
    exit 1
fi

if [[ $(az group exists -n $resource_group) == 'false' ]]; then
    az group create -l $location -n $resource_group
fi

let "uniqueness=RANDOM*RANDOM"
readonly deployment_name=deploy-contoso-$uniqueness

az deployment group create -g $resource_group \
                           -n $deployment_name \
                           --template-file $deployment_template \
                           --parameters app=$app \
                                        environment=$environment \
                                        b2c_instance=$b2c_instance \
                                        b2c_clientId=$b2c_clientId \
                                        b2c_domain=$b2c_domain \
                                        b2c_signinPolicyName=$b2c_signinPolicyName \
                                        b2c_signoutCallbackPath=$b2c_signoutCallbackPath

app_service_name=$(az deployment group show -g $resource_group -n $deployment_name --query properties.outputs.app_service_name.value -o tsv | tr -dc '[[:print:]]')
app_service_endpoint=$(az deployment group show -g $resource_group -n $deployment_name --query properties.outputs.app_service_endpoint.value -o tsv | tr -dc '[[:print:]]')

echo "##vso[task.setvariable variable=app_service_name;isOutput=true]$app_service_name"
echo "##vso[task.setvariable variable=app_service_endpoint;isOutput=true]$app_service_endpoint"