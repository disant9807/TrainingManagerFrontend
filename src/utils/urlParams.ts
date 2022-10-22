import Vue from 'vue';

function getParamsString(data: any): string {
  const ret = [];
  for (const d in data) {
    data[d] && ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
}

export default getParamsString;

export function getDomainName(): string {
  const url = window.location.hostname;
  const protocol = window.location.protocol;
  const port = protocol === 'http:' ? process.env.VUE_APP_API_HTTP : process.env.VUE_APP_API_HTTPS;
  return `${protocol}//${url}${port}/`;
}
