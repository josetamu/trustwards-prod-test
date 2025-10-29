'use client'
import 'react-day-picker/style.css';
import './proof-of-consent.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { InstallationFirst } from '../homeComponents/InstallationFirst';
import { DayPicker } from 'react-day-picker';
import { differenceInCalendarDays, format } from 'date-fns';
import { useState, useMemo, useEffect, useRef } from 'react';
import { enUS } from 'date-fns/locale';
import { supabase } from '@supabase/supabaseClient';


function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs,setWebs, consents, showNotification } = useDashboard();

    const [range, setRange] = useState({ from: undefined, to: undefined });
    const datesRef = useRef(null);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const selectedSite = webs.find(site => site.id === siteSlug);



    useEffect(() => {
        function handleClickOutside(e) {
            if (datesRef.current && !datesRef.current.contains(e.target)) {
                setOpenCalendar(false);
            }
        }

        function handleEsc(e) {
            if (e.key === 'Escape') {
                setOpenCalendar(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);
    // Read and memoize the proofs saved in Site['Proof JSON']
    const proofJSON = selectedSite?.['Proof JSON'] ?? null;
    const proofsObj = useMemo(() => {
        if (!proofJSON) return {};

        if (typeof proofJSON === 'object') return proofJSON;

        return {};
    }, [proofJSON]);

    // List of entries sorted desc by numeric id: [id, [range, today, url]]
    const proofEntries = useMemo(() => {
        const entries = Object.entries(proofsObj);
        return entries.sort(([a], [b]) => Number(b) - Number(a));
    }, [proofsObj]);

        const rangeLength = useMemo(() => {
            if (!range?.from || !range?.to) return 0;
            return differenceInCalendarDays(range.to, range.from) + 1;
        }, [range]);
    

    const monthlyLimit = 3;
    const monthlyUsed = Number(selectedSite?.['Monthly proof'] ?? 0);
    

    

    // Find the selected site based on the slug (using id like the main page)
    
    if(!webs || webs.length === 0) {
        return
    }
    
    if (!selectedSite) {
        notFound();
    }

    // If not installed, show installation screen (check directly from site data)
    if (!selectedSite.Verified) {
        return (
            <div className='proof-of-consent'>
                <InstallationFirst siteSlug={siteSlug} />
            </div>
        );
    }

    const isValidRange = range?.from && range?.to && rangeLength > 0 && rangeLength <= 8;

        // Fetch consents and build CSV from consent_data
        const fetchConsentsForRange = async (siteId) => {
            let { data, error } = await supabase
                .from('Consents')
                .select('consent_data, site_id')
                .eq('site_id', siteId);
        
            if ((!data || data.length === 0) && !error) {
                const res = await supabase
                    .from('Consents')
                    .select('consent_data, site_id')
                    .contains('consent_data', { siteid: siteId });
                data = res.data; error = res.error;
            }
        
            if (error) throw error;
        
            const items = (data || [])
                .map(r => {
                    const cd = r?.consent_data;
                    if (!cd) return null;
                    if (typeof cd === 'string') {
                        try { return JSON.parse(cd); } catch { return null; }
                    }
                    return cd;
                })
                .filter(Boolean);
               
            return items;
        };
    
        const buildCSVFromConsents = (items) => {
        
            const DELIM = ';'; // Excel (ES) suele usar ';'
            const EOL = '\r\n'; // CRLF para Excel en Windows
    
            const q = (v) => {
                const s = String(v ?? '');
                const needsQuotes = /[",;\r\n]/.test(s);
                const esc = s.replace(/"/g, '""');
                return needsQuotes ? `"${esc}"` : esc;
            };
    
            const headers = ['Date','User IP','Analytics','Marketing','Functional'];
            const rows = items.map(cd => {
                const dateStr = format(new Date(cd.ts), 'yyyy-MM-dd');
                const cat = cd?.categories || {};
                const get = (k) => {
                    if (k in cat) return !!cat[k];
                    const mk = Object.keys(cat).find(kk => kk.toLowerCase() === k.toLowerCase());
                    return mk ? !!cat[mk] : false;
                };
                const row = [
                    q(dateStr),
                    q(cd.userip || 'N/A'),
                    q(get('Analytics') ? 'true' : 'false'),
                    q(get('Marketing') ? 'true' : 'false'),
                    q(get('Functional') ? 'true' : 'false')
                ].join(DELIM);
                return row;
            });
            
            const result = [headers.map(q).join(DELIM), ...rows].join(EOL) + EOL;
            return result;
        };
    

    const handleCreate = async () => {
        if (!isValidRange) return;
        if (monthlyUsed >= monthlyLimit) return;
        if (isCreating) return;

        setIsCreating(true);
        try {   
            // 1 Generate CSV
            const fromStart = new Date(range.from); fromStart.setHours(0,0,0,0);
            const toEnd = new Date(range.to); toEnd.setHours(23,59,59,999);
    
            const items = await fetchConsentsForRange(siteSlug);
            
            // Filter by selected range (using cd.ts)
            const fromMs = fromStart.getTime();
            const toMs = toEnd.getTime();
            const filtered = (items || []).filter(cd => {
                const t = cd?.ts ? new Date(cd.ts).getTime() : NaN;
                return Number.isFinite(t) && t >= fromMs && t <= toMs;
            });

            if (filtered.length === 0) {
                showNotification('No consents found for the selected range');
                return;
            }

            // Generate CSV with only the records for the selected range
            const csv = buildCSVFromConsents(filtered);
            
            // 2 Upload to Supabase Storage...
            const bucket = 'Consents';
            const fromIso = format(range.from, 'yyyy-MM-dd');
            const toIso = format(range.to, 'yyyy-MM-dd');
            const filename = `${selectedSite.Domain}_${fromIso}_${toIso}_${Date.now()}.csv`;
            const filePath = `${siteSlug}/${filename}`;
            const uploadRes = await supabase.storage.from(bucket).upload(
                filePath,
                new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }),
                { upsert: true, contentType: 'text/csv; charset=utf-8', cacheControl: '3600' }
            );
            if (uploadRes?.error) {
                showNotification(`Error uploading proof file`);
                return;
            }
            const { data: pub } = supabase.storage.from(bucket).getPublicUrl(filePath);
            const fileUrl = pub?.publicUrl || '';

        // 3 Build the new entry and update Json 
        const rangeLabel = `${format(range.from, 'LLL dd')} - ${format(range.to, 'LLL dd')}`;
        const todayLabel = format(new Date(), 'LLLL d', { locale: enUS });

        const current = (() => {
            const v = selectedSite?.['Proof JSON'];
            if (!v) return {};
            if (typeof v === 'object') return { ...v };
            try { return JSON.parse(v); } catch { return {}; }
        })();
        const nextKey = String(Math.max(0, ...Object.keys(current).map(n => Number(n) || 0)) + 1);
        current[nextKey] = [rangeLabel, todayLabel, fileUrl || filePath];

        const { error: siteErr } = await supabase
            .from('Site')
            .update({ 'Proof JSON': current})
            .eq('id', siteSlug);
        if (siteErr) {
            showNotification('Error saving proof JSON');
            return;
        }

        // 4) Update local 
        setWebs(prev => prev.map(s => s.id === siteSlug ? { ...s, 'Proof JSON': current } : s));

        // 5) Increment monthly files
        const currentMonthly = Number(selectedSite?.['Monthly proof'] ?? 0);
        const { error: consErr } = await supabase
            .from('Site')
            .update({ "Monthly proof": currentMonthly + 1 })
            .eq('id', siteSlug);

        if (consErr) {
            showNotification('Error updating monthly files');
        } else {
            setWebs(prev => prev.map(s => s.id === siteSlug ? { ...s, 'Monthly proof': currentMonthly + 1 } : s));
            setRange({ from: undefined, to: undefined });
            showNotification('Proof created and saved');
         
        }

    } catch (e) {
        showNotification('Error creating proof');
    }finally {
        setIsCreating(false);
    }
};

    return (
        <div className='proof-of-consent'>
            <div className="proof-of-consent__header">
                <span className="proof-of-consent__header-title">
                    Proof of Consent
                </span>
                <span className="proof-of-consent__header-text">
                    In this area you can select a range of days (max. 1 week)<br/>and create a Proof of Consent file for this website (csv format).
                </span>
                <div className="proof-of-consent__header-actions">
                    <div className="proof-of-consent__header-dates-wrapper">
                        <div className="proof-of-consent__header-dates"
                            ref={datesRef}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenCalendar(v => !v)
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenCalendar(v => !v); }}
                            >
                                {range?.from && range?.to
                                ? `${format(range.from, 'MMM dd')} - ${format(range.to, 'MMM dd')}`
                                : 'Dates'}
                            

                            {openCalendar && (
                                <div
                                className="proof-of-consent__calendar-popover"
                                onClick={(e) => e.stopPropagation()}
                                >
                                <DayPicker
                                    mode="range"
                                    numberOfMonths={1}
                                    selected={range}
                                    onSelect={(nextRange, selectedDay) => {
                                        if (range?.from && range?.to && nextRange?.from && !nextRange?.to) {
                                        setRange({ from: selectedDay, to: selectedDay })
                                        return
                                        }
                                        setRange(nextRange)
                                    }}
                                    max={7}
                                    captionLayout="dropdown"
                                    navLayout="around"
                                    locale={enUS}
                                    formatters={{
                                    formatMonthDropdown: (month, options) =>
                                        format(month, 'LLL', { locale: options?.locale }),
                                    }}
                                    showOutsideDays={true}
                                    weekStartsOn={1}
                                />
                                </div>
                            )}
                        </div>
                        <div className={`proof-of-consent__header-btn ${monthlyUsed >= monthlyLimit || isCreating ? 'proof-of-consent__header-btn-disabled' : ''}`}
                             role="button"
                             aria-disabled={monthlyUsed >= monthlyLimit || isCreating}
                             onClick={() => { if (!isCreating && monthlyUsed < monthlyLimit) handleCreate(); }}>
                            {isCreating ? (
                                <span className="proof-of-consent__header-btn-spinner" aria-hidden="true"></span>
                            ) : (
                                <span className="proof-of-consent__header-btn-text">Create</span>
                            )}
                        </div>
                    </div>
                    <div className="proof-of-consent__header-monthly">
                        <div className="proof-of-consent__header-monthly-label">
                            <span className="proof-of-consent__header-monthly-label-text">Monthly files</span>
                            <span className="proof-of-consent__header-monthly-count">
                                {monthlyUsed}/{monthlyLimit}      
                            </span>
                        </div>
                        <div className="proof-of-consent__header-monthly-bar">
                            <div
                                className="proof-of-consent__header-monthly-bar-fill"
                                style={{
                                    width: `${(monthlyUsed / monthlyLimit) * 100}%`,
                                    backgroundColor: 'var(--body-light-color)',
                                    transition: 'width 0.5s'
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="proof-of-consent__divider"></div>
            <div className="proof-of-consent__content">
                    {proofEntries.length === 0 ? null : proofEntries.map(([id, [rangeText, todayText, fileUrl]]) => (
                        <div key={id} className="proof-of-consent__content-created">
                            <div className="proof-of-consent__content-created-dates">
                                <span className="proof-of-consent__content-created-dates-range">{rangeText}</span>
                                <span className="proof-of-consent__content-created-dates-today">Created on {todayText}</span>
                            </div>
                            <div className="proof-of-consent__content-created-download" tabIndex={0}
                                    role="button"
                                    aria-label="Download proof"
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') window.open(fileUrl, '_blank'); }}
                                    onClick={(e) => { e.stopPropagation(); window.open(fileUrl, '_blank'); }}
                                    >
                                <span className="proof-of-consent__content-created-download-text">
                                    Download
                                </span>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
export default Home;