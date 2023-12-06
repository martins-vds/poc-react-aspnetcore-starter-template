param app string
param environment string
param  b2c_instance string
param  b2c_clientId string
param  b2c_domain string
param  b2c_signinPolicyName string
param  b2c_signoutCallbackPath string

param location string = resourceGroup().location

param tags object = {
  environment: environment
  region: location
  app: app
}
var random_string = substring(uniqueString(resourceGroup().id), 0, 4)
var appName = '${app}-${environment}-${random_string}'
var app_insights_name = '${appName}-ai'
var app_service_plan_name = '${appName}-asp'
var app_service_web_name = '${appName}-web'
var law_name = '${appName}-law'

resource law 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: law_name
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'pergb2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    workspaceCapping: {
      dailyQuotaGb: -1
    }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource app_insights 'microsoft.insights/components@2020-02-02' = {
  name: app_insights_name
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Flow_Type: 'Redfield'
    Request_Source: 'IbizaAIExtension'
    RetentionInDays: 90
    WorkspaceResourceId: law.id
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource app_service_plan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: app_service_plan_name
  location: location
  tags: tags
  sku: {
    name: 'P1v3'
    tier: 'PremiumV3'
    size: 'P1v3'
    family: 'Pv3'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    perSiteScaling: false
    elasticScaleEnabled: false
    maximumElasticWorkerCount: 1
    isSpot: false
    reserved: true
    isXenon: false
    hyperV: false
    targetWorkerCount: 0
    targetWorkerSizeId: 0
    zoneRedundant: false
  }
}

resource app_service_web 'Microsoft.Web/sites@2021-02-01' = {
  name: app_service_web_name
  tags: tags
  location: location
  kind: 'app,linux'
  properties: {
    enabled: true
    serverFarmId: app_service_plan.id
    reserved: true
    isXenon: false
    hyperV: false
    siteConfig: {
      numberOfWorkers: 1
      linuxFxVersion: 'DOTNETCORE|8.0'
      acrUseManagedIdentityCreds: false
      alwaysOn: true
      http20Enabled: false
      functionAppScaleLimit: 0
      minimumElasticInstanceCount: 0
      appSettings: [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: app_insights.properties.ConnectionString
        }
        {
          name: 'AzureB2C__Instance'
          value: b2c_instance
        }
        {
          name: 'AzureB2C__ClientId'
          value: b2c_clientId
        }
        {
          name: 'AzureB2C__Domain'
          value: b2c_domain
        }
        {
          name: 'AzureB2C__SignUpSignInPolicyId'
          value: b2c_signinPolicyName
        }
        {
          name: 'AzureB2C__SignedOutCallbackPath'
          value: b2c_signoutCallbackPath
        }
      ]
    }
    scmSiteAlsoStopped: false
    clientAffinityEnabled: false
    clientCertEnabled: false
    clientCertMode: 'Required'
    hostNamesDisabled: false
    containerSize: 0
    dailyMemoryTimeQuota: 0
    httpsOnly: true
    redundancyMode: 'None'
    storageAccountRequired: false
    keyVaultReferenceIdentity: 'SystemAssigned'
  }
}

output app_service_name string = app_service_web.name
output app_service_endpoint string = app_service_web.properties.defaultHostName
