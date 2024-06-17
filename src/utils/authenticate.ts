import Portal from '@arcgis/core/portal/Portal.js';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo.js';
import esriId from '@arcgis/core/identity/IdentityManager.js';

const portalUrl = 'https://veidekke.cloudgis.no/enterprise/';

export const portal = new Portal({
  url: portalUrl,
});

const info = new OAuthInfo({
  portalUrl: portalUrl,
  appId: 'seEyCXJtrQgsJUIx',
  popup: false,
});

const getPortalUser = async () => {
  await portal.load();
  return portal.user.fullName;
};

export const signOut = async () => {
  esriId.destroyCredentials();
  window.location.reload();
};

export const getUserName = async () => {
  esriId.registerOAuthInfos([info]);
  await signIn();
  return await getPortalUser();
};

const checkCurrentStatus = async () => {
  try {
    const credential = await esriId.checkSignInStatus(`${info.portalUrl}/sharing`);
    return credential;
  } catch (error) {
    console.warn(error);
  }
};

const signIn = async () => {
  try {
    const credential = (await checkCurrentStatus()) || (await fetchCredentials());
    return credential;
  } catch (error) {
    const credential = await fetchCredentials();
    return credential;
  }
};

const fetchCredentials = async () => {
  try {
    const credential = await esriId.getCredential(`${info.portalUrl}/sharing`);
    return credential;
  } catch (error) {
    console.warn(error);
  }
};
