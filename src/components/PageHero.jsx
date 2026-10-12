export default function PageHero({ eyebrow, title, description, children }) {
  return <section className="page-hero"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{children}</section>;
}
