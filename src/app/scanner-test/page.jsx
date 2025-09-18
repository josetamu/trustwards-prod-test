import Scanner from '@components/scan/scanner';

export default function Page() {
    // Domain and siteId (urlPath for the domain)
    const domain = 'cookies-playground.trustwards.io';
    const siteId = '6065991d-0a90-4bd6-9215-1f13e6e4a04c';
    const urlPath = '/';
  
    return (
      <main>
        <Scanner domain={domain} siteId={siteId} urlPath={urlPath}/>
      </main>
    );
}