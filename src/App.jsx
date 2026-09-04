import { useState } from 'react'
import './App.css'

const analyses = {
    'linear.app': {
        title: 'linear.app', category: 'SaaS / Product management', date: '04 Sep 2026, 10:42', technologies: [
            { name: 'React', type: 'JavaScript framework', percentage: 34, color: '#7b61ff', icon: '⚛' },
            { name: 'Vercel', type: 'Hosting & deployment', percentage: 22, color: '#171717', icon: '▲' },
            { name: 'TypeScript', type: 'Programming language', percentage: 18, color: '#3178c6', icon: 'TS' },
            { name: 'Tailwind CSS', type: 'CSS framework', percentage: 14, color: '#35b8d5', icon: '≋' },
            { name: 'Next.js', type: 'Web framework', percentage: 8, color: '#111111', icon: 'N' },
            { name: 'その他', type: 'Analytics, CDN & tools', percentage: 4, color: '#d8d5ce', icon: '•••' },
        ]
    },
    'shopify.com': {
        title: 'shopify.com', category: 'E-commerce platform', date: '04 Sep 2026, 10:43', technologies: [
            { name: 'Shopify', type: 'E-commerce platform', percentage: 42, color: '#95bf47', icon: 'S' },
            { name: 'React', type: 'JavaScript framework', percentage: 21, color: '#7b61ff', icon: '⚛' },
            { name: 'Ruby', type: 'Programming language', percentage: 16, color: '#cc342d', icon: 'Rb' },
            { name: 'Google Analytics', type: 'Analytics', percentage: 10, color: '#fbbc04', icon: 'G' },
            { name: 'Cloudflare', type: 'CDN & security', percentage: 7, color: '#f38020', icon: '◆' },
            { name: 'その他', type: 'Analytics, CDN & tools', percentage: 4, color: '#d8d5ce', icon: '•••' },
        ]
    },
}

function formatScanDate(date = new Date()) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day} ${month} ${year}, ${hours}:${minutes}`
}

function buildFallbackAnalysis(siteTitle) {
    const seed = Array.from(siteTitle).reduce((total, character) => total + character.charCodeAt(0), 0)
    const primary = [
        26 + (seed % 5),
        20 + ((seed + 2) % 5),
        16 + ((seed + 4) % 4),
        12 + ((seed + 6) % 3),
    ]
    const other = 100 - primary.reduce((sum, value) => sum + value, 0)

    return {
        title: siteTitle,
        category: 'Custom website',
        date: formatScanDate(),
        technologies: [
            { name: 'React', type: 'JavaScript framework', percentage: primary[0], color: '#7b61ff', icon: '⚛' },
            { name: 'Node.js', type: 'Runtime environment', percentage: primary[1], color: '#68a063', icon: 'N' },
            { name: 'TypeScript', type: 'Programming language', percentage: primary[2], color: '#3178c6', icon: 'TS' },
            { name: 'Cloudflare', type: 'CDN & security', percentage: primary[3], color: '#f38020', icon: '◆' },
            { name: 'その他', type: 'Analytics, CDN & tools', percentage: other, color: '#d8d5ce', icon: '•••' },
        ],
    }
}

function Icon({ name }) {
    const paths = {
        grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
        history: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></>,
        settings: <><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /><circle cx="12" cy="12" r="4" /></>,
        moon: <><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" /></>,
        sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
        arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
        globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z" /></>,
        check: <path d="m5 12 4 4L19 6" />,
    }
    return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function App() {
    const [url, setUrl] = useState('linear.app')
    const [isDarkMode, setIsDarkMode] = useState(() => window.localStorage.getItem('techmap-theme') === 'dark')
    const [activeView, setActiveView] = useState('overview')
    const [analysis, setAnalysis] = useState(analyses['linear.app'])
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [historyItems, setHistoryItems] = useState([
        { id: 'linear.app', title: 'linear.app', category: 'SaaS / Product management', date: '04 Sep 2026, 10:42' },
        { id: 'shopify.com', title: 'shopify.com', category: 'E-commerce platform', date: '04 Sep 2026, 10:43' },
    ])

    const handleAnalyze = (event) => {
        event.preventDefault()
        const normalizedUrl = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase() || 'linear.app'
        setIsAnalyzing(true)

        window.setTimeout(() => {
            const nextAnalysis = analyses[normalizedUrl] || buildFallbackAnalysis(normalizedUrl)
            setAnalysis(nextAnalysis)
            setHistoryItems((previous) => {
                const nextEntry = { id: normalizedUrl, title: nextAnalysis.title, category: nextAnalysis.category, date: nextAnalysis.date }
                const withoutDuplicate = previous.filter((item) => item.id !== normalizedUrl)
                return [nextEntry, ...withoutDuplicate].slice(0, 5)
            })
            setActiveView('overview')
            setIsAnalyzing(false)
        }, 450)
    }

    const handleHistorySelect = (siteName) => {
        const nextAnalysis = analyses[siteName] || buildFallbackAnalysis(siteName)
        setAnalysis(nextAnalysis)
        setActiveView('overview')
    }

    const totalTechnologies = analysis.technologies.length
    const categoryRows = [
        ['Frontend', `${Math.min(54, Math.round(analysis.technologies[0].percentage))}%`, '#7b61ff'],
        ['Infrastructure', `${Math.min(22, Math.max(8, Math.round(analysis.technologies[1]?.percentage || 22)))}%`, '#171717'],
        ['Language', `${Math.min(18, Math.max(8, Math.round(analysis.technologies[2]?.percentage || 18)))}%`, '#3178c6'],
        ['Other', `${Math.max(6, 100 - (analysis.technologies[0].percentage + analysis.technologies[1].percentage + analysis.technologies[2].percentage + (analysis.technologies[3]?.percentage || 0)))}%`, '#d8d5ce'],
    ]

    const toggleTheme = () => {
        setIsDarkMode((currentValue) => {
            const nextValue = !currentValue
            window.localStorage.setItem('techmap-theme', nextValue ? 'dark' : 'light')
            return nextValue
        })
    }

    return <div className={`app-shell ${isDarkMode ? 'dark-mode' : ''}`}>
        <aside className="sidebar">
            <div className="brand"><span className="brand-mark">⌁</span><span>stacktrace</span></div>
            <div className="workspace-label">WORKSPACE</div>
            <nav>
                <button type="button" className={`nav-item ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}><Icon name="grid" /> Overview</button>
                <button type="button" className={`nav-item ${activeView === 'history' ? 'active' : ''}`} onClick={() => setActiveView('history')}><Icon name="history" /> History <span className="nav-count">{historyItems.length}</span></button>
            </nav>
            <div className="sidebar-bottom"><button className="nav-item"><Icon name="settings" /> Settings</button><div className="profile"><span className="avatar">YA</span><span><strong>Yusuf A.</strong><small>Free plan</small></span><span className="dots">•••</span></div></div>
        </aside>

        <main className="main-content">
            <header className="topbar"><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{activeView === 'history' ? 'History' : 'Overview'}</strong></div><div className="top-actions"><span className="status"><i /> All systems operational</span><button type="button" className="theme-button" onClick={toggleTheme} aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}><Icon name={isDarkMode ? 'sun' : 'moon'} /></button><button className="help-button">?</button></div></header>
            <div className="content-wrap">
                <section className="intro"><div><p className="eyebrow">WEBSITE INTELLIGENCE</p><h1>Understand what powers the web.</h1><p className="intro-copy">Analyze any website to uncover its technology stack,<br className="desktop-break" /> frameworks, and the tools behind it.</p></div><div className="scan-orbit"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="orbit-dot" /></div></section>
                <form className="analyzer-form" onSubmit={handleAnalyze}><div className="url-field"><Icon name="globe" /><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Enter a website URL" aria-label="Website URL" /><span className="secure">SECURE</span></div><button className="analyze-button" type="submit" disabled={isAnalyzing}>{isAnalyzing ? 'Analyzing...' : <>Analyze <Icon name="arrow" /></>}</button></form>
                <div className="quick-sites"><span>TRY A SAMPLE</span><button type="button" onClick={() => setUrl('linear.app')}>linear.app</button><button type="button" onClick={() => setUrl('shopify.com')}>shopify.com</button></div>
                <section className="results-header"><div><div className="result-title"><span className="site-favicon">{analysis.title.charAt(0).toUpperCase()}</span><h2>{analysis.title}</h2><span className="verified"><Icon name="check" /> Analyzed</span></div><p className="result-meta">{analysis.category} <span>•</span> Last scanned {analysis.date}</p></div><button type="button" className="export-button">Export report <span>↗</span></button></section>
                <section className="dashboard-grid"><article className="panel distribution-panel"><div className="panel-heading"><div><p className="section-kicker">TECHNOLOGY DISTRIBUTION</p><h3>What this site is built with</h3></div><button type="button" className="more-button">•••</button></div><div className="distribution-content"><div className="donut-wrap"><div className="donut" style={{
                    background: `conic-gradient(${analysis.technologies.map((technology, index) => {
                        const previous = analysis.technologies.slice(0, index).reduce((total, item) => total + item.percentage, 0)
                        return `${technology.color} ${previous}% ${previous + technology.percentage}%`
                    }).join(', ')})`
                }}><div><strong>{totalTechnologies}</strong><span>technologies</span></div></div></div><div className="legend">{analysis.technologies.map((technology) => <div className="legend-row" key={technology.name}><span className="legend-icon" style={{ '--tech-color': technology.color }}>{technology.icon}</span><span className="legend-name">{technology.name}<small>{technology.type}</small></span><span className="legend-percent">{technology.percentage}%</span></div>)}</div></div></article><article className="panel insight-panel"><div className="panel-heading"><div><p className="section-kicker">QUICK INSIGHT</p><h3>Stack profile</h3></div><span className="insight-spark">✦</span></div><div className="insight-stat"><strong>{analysis.technologies[0]?.name || 'Modern'}</strong><span>technology profile</span></div><p className="insight-copy">A frontend-first stack with a strong focus on speed, type safety, and scalable deployment.</p><div className="meter"><span /><span /><span /><span /><span /></div><div className="insight-footer"><span>Performance ready</span><b>High confidence</b></div></article></section>
                <section className="bottom-row"><article className="panel categories-panel"><div className="panel-heading"><div><p className="section-kicker">CATEGORIES</p><h3>Technology by category</h3></div><button type="button" className="more-button">•••</button></div><div className="category-list">{categoryRows.map(([name, percentage, color]) => <div className="category-row" key={name}><div><span className="category-dot" style={{ background: color }} /><strong>{name}</strong></div><span>{percentage}</span><div className="category-track"><i style={{ width: percentage, background: color }} /></div></div>)}</div></article><article className="panel activity-panel"><div className="panel-heading"><div><p className="section-kicker">RECENT ACTIVITY</p><h3>Your analyses</h3></div><button type="button" className="view-all">View all <Icon name="arrow" /></button></div><div className="activity-list">{historyItems.map((item, index) => <button type="button" key={item.id} className="activity-row" onClick={() => handleHistorySelect(item.id)}><span className={`activity-avatar ${index % 2 === 0 ? 'green' : index % 3 === 0 ? 'blue' : 'orange'}`}>{item.title.charAt(0).toUpperCase()}</span><span><strong>{item.title}</strong><small>{item.date}</small></span><b>{analysis.title === item.title ? `${analysis.technologies.length} techs` : `${(analyses[item.id]?.technologies?.length || 5)} techs`}</b></button>)}</div></article></section>
            </div>
        </main>
    </div>
}

export default App
