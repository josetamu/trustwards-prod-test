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
    const { webs, consents } = useDashboard();

    const [range, setRange] = useState({ from: undefined, to: undefined });
    const datesRef = useRef(null);
    const [openCalendar, setOpenCalendar] = useState(false);

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
    const rangeLength = useMemo(() => {
        if (!range?.from || !range?.to) return 0;
        return differenceInCalendarDays(range.to, range.from) + 1;
    }, [range]);
    
    // Consents usage for this site
    const consentForSite = useMemo(
        () => (consents || []).find(c => c.site_id === siteSlug),
        [consents, siteSlug]
    );
    const monthlyLimit = 3;
    const monthlyUsed = Number(consents.find(c => c.site_id === siteSlug)?.['Monthly files'] ?? 0);

    

    // Find the selected site based on the slug (using id like the main page)
    const selectedSite = webs.find(site => site.id === siteSlug);
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



    const isValidRange = range?.from && range?.to && rangeLength > 0 && rangeLength <= 7;


    const handleCreate = async () => {
        if (!isValidRange) return;

        // Aquí deberías generar el CSV con el rango [range.from, range.to]


        // Increment the monthly file in the database
        try {
            // Get the consent record for this site
            const currentConsent = consents.find(c => c.site_id === siteSlug);
            const currentMonthly = Number(currentConsent?.['Monthly files'] ?? 0);

            // Update the value in the database (supabase)
            const { error } = await supabase
                .from('Consents')
                .update({ "Monthly files": currentMonthly + 1 })
                .eq('site_id', siteSlug);

            if (error) {
                showNotification('Error updating monthly files');
            } else {
                showNotification('CSV created and monthly files incremented');
            }

            // Optional: Update the local state to reflect the instantaneous change in the UI
            if (currentConsent) {
                currentConsent['Monthly files'] = currentMonthly + 1;
            }
        } catch (err) {
            showNotification('Error creating proof of consent');
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
                        <div className="proof-of-consent__header-btn" onClick={handleCreate}>
                            <span className="proof-of-consent__header-btn-text">Create</span>
                        </div>
                    </div>
                    <div className="proof-of-consent__header-monthly">
                        <div className="proof-of-consent__header-monthly-label">
                            <span className="proof-of-consent__header-monthly-label-text">Monthly</span>
                            <span className="proof-of-consent__header-monthly-count">
                                {monthlyUsed}/{monthlyLimit}      
                            </span>
                        </div>
                        <div className="proof-of-consent__header-monthly-bar">
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="proof-of-consent__divider"></div>
            <div className="proof-of-consent__content">

            </div>
        </div>
    );
}
export default Home;