const skills = [
  { name: "LLM-Powered Automation", side: "left" },
  { name: "Advanced SQL & Data Modeling", side: "right" },
  { name: "Agentic Workflows", side: "left" },
  { name: "ETL & Data Warehousing", side: "right" },
  { name: "Generative Media & Prompt Engineering", side: "left" },
  { name: "Big Data Processing", side: "right" },
  { name: "Time-Series & Longitudinal Data", side: "left" },
  { name: "Backend & APIs", side: "right" },
  { name: "Vector Search & Text Embeddings", side: "left" },
  { name: "Cloud & DevOps", side: "right" },
  { name: "Cost-Aware Data Platform Design", side: "left" },
  { name: "Dashboards & Analytics", side: "right" },
];

function TechTree() {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="tech-tree">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMin meet">
        <path
          d="M50 5 L50 85"
          stroke="#000000"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 80,
            strokeDashoffset: 80 * (1 - scrollProgress),
          }}
        />

        {skills.map((skill, index) => {
          const yPos = 12 + index * 4.2;
          const start = 0.1;
          const step = 0.06;
          const speed = 3;
          const branchProgress = Math.max(0, (scrollProgress - (index * step + start)) * speed);
          const isLeft = skill.side === "left";
          const branchEndX = isLeft ? 15 : 85;
          const CHIP_W = 33;
          const CHIP_H = 5.4;
          const CHIP_RX = 2.7;
          const chipX = isLeft ? 2 : 100 - CHIP_W - 2;

          return (
            <g key={skill.name}>
              <path
                d={`M50 ${yPos} L${branchEndX} ${yPos}`}
                stroke="#000000"
                strokeWidth="0.3"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 35,
                  strokeDashoffset: Math.max(0, 35 - branchProgress * 35),
                }}
              />

              <circle
                cx="50"
                cy={yPos}
                r="0.4"
                fill="#000000"
                style={{
                  opacity: Math.min(1, branchProgress * 1.5),
                }}
              />

              <g
                style={{
                  opacity: Math.min(1, branchProgress * 2),
                  transform: `translateY(${Math.max(0, (1 - branchProgress) * 2)}px)`,
                }}
              >
                <rect
                  x={chipX}
                  y={yPos - CHIP_H / 2}
                  width={CHIP_W}
                  height={CHIP_H}
                  rx={CHIP_RX}
                  fill="#000000"
                  stroke="#000000"
                  strokeWidth="0.1"
                />

                <text
                  x={chipX + CHIP_W / 2}
                  y={yPos + 0.5}
                  textAnchor="middle"
                  fontSize="1.95"
                  fill="#ffffff"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="600"
                >
                  {skill.name}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Mount the component when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const root = document.createElement('div');
  root.id = 'tech-tree-root';
  document.body.appendChild(root);
  
  // Use React 17 style rendering for compatibility
  ReactDOM.render(
    <TechTree />,
    document.getElementById('tech-tree-root')
  );
});
