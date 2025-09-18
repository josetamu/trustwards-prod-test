import { useParams } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import './ScriptCopy.css';
import UserNameSkeleton from '@components/Skeletons/UserNameSkeleton';

const ScriptCopy = () => {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { handleCopy } = useDashboard();

    
   

  
    const script = `
    <script>https://trustwards.io/cdn/${siteSlug}.js</script>
    `;

    const handleCopyClick = () => {
        handleCopy(siteSlug, 'bottom', true);
    };

    return (
        <div className='script-copy'>
            <span className='script-copy__script'>{script}</span>
            <svg className='script-copy__copy' onClick={handleCopyClick} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_393_746)">
                <path d="M5.25 8.75C5.25 7.1001 5.25 6.27515 5.76256 5.76256C6.27515 5.25 7.1001 5.25 8.75 5.25H9.33333C10.9832 5.25 11.8082 5.25 12.3208 5.76256C12.8333 6.27515 12.8333 7.1001 12.8333 8.75V9.33333C12.8333 10.9832 12.8333 11.8082 12.3208 12.3208C11.8082 12.8333 10.9832 12.8333 9.33333 12.8333H8.75C7.1001 12.8333 6.27515 12.8333 5.76256 12.3208C5.25 11.8082 5.25 10.9832 5.25 9.33333V8.75Z" stroke="#686B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.91693 5.24935C9.91553 3.52438 9.88946 2.63089 9.38732 2.0191C9.29037 1.90095 9.18205 1.79262 9.06392 1.69566C8.41853 1.16602 7.4597 1.16602 5.54199 1.16602C3.6243 1.16602 2.66545 1.16602 2.02008 1.69566C1.90193 1.79261 1.7936 1.90095 1.69664 2.0191C1.16699 2.66447 1.16699 3.62332 1.16699 5.54102C1.16699 7.45872 1.16699 8.41755 1.69664 9.06295C1.79359 9.18107 1.90193 9.2894 2.02008 9.38635C2.63186 9.88848 3.52536 9.91456 5.25033 9.91596" stroke="#686B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                <clipPath id="clip0_393_746">
                <rect width="14" height="14" fill="white"/>
                </clipPath>
                </defs>
            </svg>
        </div>
    );
};

export default ScriptCopy;