import Section from '../components/Section'

const TEAM = [
  {
    name: 'Atharva Ghule',
    role: 'Full-Stack Developer and Lead Designer',
    contrib: 'Owns overall code and visual direction; integrates and reviews work',
  },
  {
    name: 'Shubham Jadhav',
    role: 'Frontend Developer (Layout)',
    contrib: 'Page structure, sidebar and mobile layout',
  },
  {
    name: 'Harshad Hanmant Shewale',
    role: 'Frontend Developer (Interactive)',
    contrib: 'Block calculator and interactive elements',
  },
  {
    name: 'Parmeshwar Sanjay Dongapure',
    role: 'Deployment Engineer',
    contrib: 'Single-file build, GitHub workflow and publishing',
  },
  {
    name: 'Meera Jyotirmay Hulyalkar',
    role: 'Blueprint Designer (Process Flow)',
    contrib: 'FIG. 01, 02 and 06',
  },
  {
    name: 'Samiksha Bapurao Chopade',
    role: 'Blueprint Designer (Structure)',
    contrib: 'FIG. 03, 04 and 05',
  },
  {
    name: 'Shraddha Suresh Gahile',
    role: 'Technical Writer (Foundations)',
    contrib: 'Overview, cloud file handling, splitting',
  },
  {
    name: 'Humera Wasim Baig',
    role: 'Technical Writer (Security)',
    contrib: 'Encryption section',
  },
  {
    name: 'Sanket Satish Bande',
    role: 'Technical Writer (Data Flow)',
    contrib: 'Archive/download and recovery sections',
  },
  {
    name: 'Eshwari Vikas Kolpekwar',
    role: 'Technical Writer (Cloud) and FIG. 07 Designer',
    contrib: 'AWS boundary, limitations, FIG. 07',
  },
  {
    name: 'Vedashri Potu',
    role: 'Glossary, References and Report Lead',
    contrib: 'Glossary, references, report',
  },
  {
    name: 'Samruddhi Sahadu Thopate',
    role: 'Technical Reviewer (Fact-Checker)',
    contrib: 'Checks claims against code and README',
  },
  {
    name: 'Siddhi Subhash Shinde',
    role: 'QA Tester',
    contrib: 'Phone/desktop, links, navigation, spelling',
  },
]

const REFERENCES = [
  {
    title: 'Project repository',
    url: 'https://github.com/athen-g/CloudBlock',
  },
  {
    title: 'Live documentation',
    url: 'https://d3kx026zzkouwc.cloudfront.net',
  },
  {
    title: 'React',
    url: 'https://react.dev',
  },
  {
    title: 'Vite',
    url: 'https://vite.dev',
  },
  {
    title: 'vite-plugin-singlefile',
    url: 'https://github.com/richardtallent/vite-plugin-singlefile',
  },
  {
    title: 'HDFS Architecture (background reference)',
    url: 'https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html',
  },
  {
    title: 'AES-GCM (NIST SP 800-38D)',
    url: 'https://csrc.nist.gov/pubs/sp/800/38/d/final',
  },
  {
    title: 'PBKDF2 (RFC 8018)',
    url: 'https://www.rfc-editor.org/rfc/rfc8018',
  },
]

export default function Footer() {
  return (
    <Section id="project" number="09" title="Limitations, Team & References">
      <h3>Known Limitations</h3>
      <ul>
        <li>Single-user prototype with no accounts, authentication system, or user management.</li>
        <li>No password recovery mechanism. A forgotten password means permanent data loss.</li>
        <li>No file deletion UI in the current version.</li>
        <li>Maximum file size: 10 MiB.</li>
        <li>Password and file data pass through local HTTP and server memory — do not expose to LAN or internet.</li>
        <li>Eight local test methods have been run and passed. These tests validate the encryption and decryption logic locally and do not test or validate the AWS deployment.</li>
      </ul>

      <h3>Team</h3>
      <div className="team-table-wrap">
        <table className="team-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
              <th scope="col">Contribution</th>
            </tr>
          </thead>
          <tbody>
            {TEAM.map((member) => (
              <tr key={member.name}>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td>{member.contrib}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Course &amp; College</h3>
      <ul>
        <li>Mini Project 2, Group 2</li>
        <li>TE Computer Engineering</li>
        <li>MES Wadia College of Engineering, Pune</li>
      </ul>

      <h3>References</h3>
      <ul className="ref-list">
        {REFERENCES.map((ref) => (
          <li key={ref.url}>
            {ref.title} —{' '}
            <a href={ref.url} target="_blank" rel="noopener noreferrer">
              {ref.url}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
