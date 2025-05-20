export function Sidebar({ pages }) {
    return (
        <div className="sidebar">
            {pages.map((page) => (
                <a href={`${page}.jsx`}>{page}</a>
            ))}
        </div>
    )
}