export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'General' | 'Business' | 'Corporate' | 'Legal' | 'Resumes' | 'Academic';
  icon: string;
  contentHtml: string;
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start from a clean slate with standard margins and typography.',
    category: 'General',
    icon: 'FileText',
    contentHtml: '<p></p>',
  },
  {
    id: 'nda-agreement',
    name: 'Corporate Non-Disclosure Agreement (NDA)',
    description: 'Bilateral legal non-disclosure contract covering trade secrets and proprietary data.',
    category: 'Legal',
    icon: 'FileText',
    contentHtml: `
      <h1>MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT</h1>
      <p>This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of <strong>November 4, 2026</strong> ("Effective Date"), by and between:</p>
      <p><strong>Party A:</strong> Acme Enterprise Solutions Inc., a Delaware corporation having its principal office at 100 Market St, Suite 500, San Francisco, CA 94105.</p>
      <p><strong>Party B:</strong> Strategic Technologies LLC, a corporation having its principal office at 450 Lexington Ave, New York, NY 10017.</p>
      <hr />

      <h2>1. Purpose of Disclosure</h2>
      <p>The parties wish to explore a potential strategic commercial partnership concerning desktop productivity software, cross-platform client architecture, and enterprise cloud synchronization ("Authorized Purpose").</p>

      <h2>2. Definition of Confidential Information</h2>
      <p>"Confidential Information" encompasses all non-public technical, commercial, financial, and operational data disclosed by either party, whether disclosed orally, visually, in writing, or electronically, including source code, specifications, and client lists.</p>

      <h2>3. Obligations of Receiving Party</h2>
      <ul>
        <li>Maintain strict confidentiality using at least the degree of care used for its own confidential assets.</li>
        <li>Disclose information only to employees, contractors, and legal advisors with a strict need to know.</li>
        <li>Refrain from reverse engineering, decompiling, or creating derivative works based on disclosed assets.</li>
      </ul>

      <h2>4. Term and Termination</h2>
      <p>This Agreement and the duty of confidentiality shall remain binding for a period of <strong>three (3) years</strong> from the Effective Date.</p>

      <table>
        <thead>
          <tr>
            <th>Party A Authorized Signature</th>
            <th>Party B Authorized Signature</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name: Jonathan Sterling<br />Title: VP Commercial Partnerships<br />Date: Nov 4, 2026</td>
            <td>Name: Katherine Reynolds<br />Title: Managing Director<br />Date: Nov 4, 2026</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'financial-report',
    name: 'Corporate Annual Financial Report',
    description: 'Executive financial summary with revenue breakdown, balance metrics, and outlook.',
    category: 'Corporate',
    icon: 'Briefcase',
    contentHtml: `
      <h1>Corporate Financial Performance & Strategic Review: FY 2026</h1>
      <p><strong>Reporting Entity:</strong> Global Holdings Group Inc.</p>
      <p><strong>Published:</strong> Q4 2026 | <strong>Audited by:</strong> Ernst & Advisory LLP</p>
      <hr />

      <h2>1. Executive Financial Highlights</h2>
      <p>Fiscal Year 2026 exhibited unprecedented operational efficiency and recurring revenue expansion across all software divisions. Total consolidated revenues climbed 28.4% year-over-year to $142.8M.</p>

      <h2>2. Consolidated Revenue & Profitability Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Division / Line of Business</th>
            <th>FY 2025 (USD)</th>
            <th>FY 2026 (USD)</th>
            <th>YoY Variance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Desktop Productivity Suite (Wordo)</td>
            <td>$42,300,000</td>
            <td>$61,800,000</td>
            <td>+46.1%</td>
          </tr>
          <tr>
            <td>Cloud Workspace & Synchronization</td>
            <td>$38,100,000</td>
            <td>$49,200,000</td>
            <td>+29.1%</td>
          </tr>
          <tr>
            <td>Enterprise Professional Services</td>
            <td>$30,800,000</td>
            <td>$31,800,000</td>
            <td>+3.2%</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Forward Operating Guidance</h2>
      <blockquote>
        "Our strategic transition to local-first desktop software powered by modern lightweight runtimes has permanently lowered server overhead while accelerating customer satisfaction."
      </blockquote>
      <p>Capital deployment for upcoming quarters will focus on offline proofing machine learning models and cross-platform native installers.</p>
    `,
  },
  {
    id: 'sop-manual',
    name: 'Standard Operating Procedure (SOP) Manual',
    description: 'Structured enterprise operational procedure with scope, responsibilities, and flowchart.',
    category: 'Corporate',
    icon: 'Briefcase',
    contentHtml: `
      <h1>STANDARD OPERATING PROCEDURE: INCIDENT RESPONSE & RELEASE MANAGEMENT</h1>
      <p><strong>Document ID:</strong> SOP-OPS-2026-04 | <strong>Version:</strong> 2.4 | <strong>Effective:</strong> November 2026</p>
      <hr />

      <h2>1. Purpose and Scope</h2>
      <p>This procedure establishes standardized protocols for detecting, reporting, mitigating, and documenting operational anomalies across production client application distributions.</p>

      <h2>2. Roles and Responsibilities</h2>
      <ul>
        <li><strong>Incident Commander:</strong> Directs triage conference, assigns technical leads, and liaises with executive leadership.</li>
        <li><strong>Lead Systems Architect:</strong> Conducts root-cause inspection of local state and crash logs.</li>
        <li><strong>Communications Liaison:</strong> Drafts customer notifications and post-mortem incident documentation.</li>
      </ul>

      <h2>3. Incident Escalation Severity Matrix</h2>
      <table>
        <thead>
          <tr>
            <th>Severity Level</th>
            <th>Definition</th>
            <th>Response SLA</th>
            <th>Target Resolution</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>P1 – Critical</td>
            <td>Data corruption or unsaved document loss affecting active sessions</td>
            <td>15 minutes</td>
            <td>Under 2 hours</td>
          </tr>
          <tr>
            <td>P2 – High</td>
            <td>Core formatting degradation or DOCX export failure</td>
            <td>1 hour</td>
            <td>Under 8 hours</td>
          </tr>
          <tr>
            <td>P3 – Medium</td>
            <td>Minor UI visual alignment or non-critical menu rendering</td>
            <td>4 hours</td>
            <td>Next Release Sprint</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Post-Incident Review Protocol</h2>
      <p>Within 48 hours of resolving any P1 or P2 incident, the engineering organization must complete a blameless post-mortem analysis detailing contributing timeline factors and automated regression tests.</p>
    `,
  },
  {
    id: 'software-architecture-spec',
    name: 'Software Architecture Specification (RFC)',
    description: 'Technical request for comments detailing system design, IPC boundaries, and security.',
    category: 'Corporate',
    icon: 'BookOpen',
    contentHtml: `
      <h1>RFC 042: High-Performance OpenXML Document Processing Engine</h1>
      <p><strong>Status:</strong> Approved | <strong>Author:</strong> Lead Architect | <strong>Target:</strong> Wordo v1.0</p>
      <hr />

      <h2>1. Problem Statement</h2>
      <p>Conventional web-based text areas fail to guarantee OpenXML (.docx) round-trip fidelity, leading to dropped table borders, unsupported formatting marks, and erratic pagination across different operating systems.</p>

      <h2>2. Proposed Architectural Solution</h2>
      <p>We propose a decoupled layered architecture:</p>
      <ul>
        <li><strong>Presentation Layer:</strong> React 19 + Tiptap ProseMirror DOM canvas with A4/Letter pagination rules.</li>
        <li><strong>Serialization Layer:</strong> OpenXML schema serializer generating structured ECMA-376 compliant XML packages.</li>
        <li><strong>Native Runtime Layer:</strong> Tauri 2 Rust commands handling atomic file writes, crash vaults, and OS sandboxing.</li>
      </ul>

      <h2>3. Security and Permission Boundaries</h2>
      <p>The native backend verifies file paths against safe user-selected dialog directories, prohibiting unrestricted arbitrary directory traversal.</p>
    `,
  },
  {
    id: 'business-proposal',
    name: 'Business Project Proposal',
    description: 'Comprehensive business proposal with executive summary, deliverables table, and budget.',
    category: 'Business',
    icon: 'Briefcase',
    contentHtml: `
      <h1>Strategic Project Proposal: Cloud Modernization</h1>
      <p><strong>Prepared for:</strong> Executive Steering Committee</p>
      <p><strong>Prepared by:</strong> Global Solutions Group</p>
      <p><strong>Date:</strong> November 2026</p>
      <hr />
      <h2>1. Executive Summary</h2>
      <p>This proposal outlines a phased modernization roadmap designed to consolidate disparate legacy infrastructure, reduce operational overhead by 32%, and enable rapid delivery of client-facing digital services.</p>
      
      <h2>2. Project Objectives & Scope</h2>
      <ul>
        <li>Migrate core on-premise compute workloads to modern cloud infrastructure.</li>
        <li>Implement automated CI/CD deployment pipelines with zero-downtime rollouts.</li>
        <li>Standardize data governance, encryption at rest, and automated backup compliance.</li>
      </ul>

      <h2>3. Timeline and Milestone Deliverables</h2>
      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Milestone Objective</th>
            <th>Target Completion</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Phase 1</td>
            <td>Infrastructure Audit & Security Assessment</td>
            <td>Month 1</td>
            <td>Complete</td>
          </tr>
          <tr>
            <td>Phase 2</td>
            <td>Core Migration & Platform Staging</td>
            <td>Month 3</td>
            <td>In Progress</td>
          </tr>
          <tr>
            <td>Phase 3</td>
            <td>User Acceptance Testing & Performance Tuning</td>
            <td>Month 5</td>
            <td>Planned</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'resume',
    name: 'Modern Executive Resume',
    description: 'A clean, ATS-friendly curriculum vitae emphasizing skills and achievements.',
    category: 'Resumes',
    icon: 'User',
    contentHtml: `
      <h1>Alex Morgan</h1>
      <p><strong>Senior Software Architect & Engineering Leader</strong></p>
      <p>San Francisco, CA • alex.morgan@example.com • +1 (555) 234-5678 • linkedin.com/in/alexmorgan</p>
      <hr />
      <h2>Executive Summary</h2>
      <p>Dynamic and results-driven Software Engineering Leader with over 10 years of experience designing scalable cross-platform systems, managing high-performing engineering teams, and delivering mission-critical applications.</p>
      
      <h2>Core Competencies</h2>
      <ul>
        <li><strong>Architecture:</strong> Distributed systems, Cloud-native services, Tauri/Desktop runtime, Microservices</li>
        <li><strong>Languages & Frameworks:</strong> TypeScript, Rust, React, Python, Go, Node.js</li>
        <li><strong>Leadership:</strong> Agile transformation, Sprint planning, Mentorship, Cross-functional alignment</li>
      </ul>
    `,
  },
  {
    id: 'formal-letter',
    name: 'Formal Business Letter',
    description: 'Standard corporate letterhead layout with sender and recipient blocks.',
    category: 'Business',
    icon: 'Mail',
    contentHtml: `
      <p><strong>Acme Corporation</strong><br />100 Market Street, Suite 500<br />San Francisco, CA 94105</p>
      <p>November 4, 2026</p>
      
      <p><strong>Ms. Katherine Reynolds</strong><br />Director of Enterprise Procurement<br />Global Logistics Partners<br />450 West End Avenue<br />New York, NY 10024</p>

      <p>Dear Ms. Reynolds,</p>

      <p>Thank you for taking the time to discuss our enterprise software licensing agreement last week. We were delighted to learn more about your organization's expansion goals for the upcoming fiscal year.</p>

      <p>Sincerely,</p>
      <p><strong>Jonathan Sterling</strong><br />Vice President, Commercial Partnerships<br />Acme Corporation</p>
    `,
  },
  {
    id: 'employee-handbook',
    name: 'Corporate Employee Handbook',
    description: 'Comprehensive organizational guidelines, code of conduct, and workplace policies.',
    category: 'Corporate',
    icon: 'Briefcase',
    contentHtml: `
      <h1>ENTERPRISE EMPLOYEE HANDBOOK & CODE OF CONDUCT</h1>
      <p><em>Revision 2026.4 — Confidential & Proprietary for Internal Circulation Only</em></p>
      <hr />
      <h2>1. Welcome and Company Culture</h2>
      <p>Welcome to Acme Corporation. We are committed to fostering an innovative, inclusive, and collaborative working environment where every team member is empowered to perform their best work.</p>
      
      <h2>2. Core Workplace Standards</h2>
      <ul>
        <li><strong>Integrity:</strong> Honest and transparent conduct in all commercial dealings, regulatory reporting, and internal communications.</li>
        <li><strong>Excellence:</strong> Delivering robust, user-centric software solutions that meet international quality and security standards.</li>
        <li><strong>Collaboration:</strong> Respectful, prompt, and supportive teamwork across distributed remote and in-office units.</li>
      </ul>

      <h2>3. Information Security and Acceptable Use</h2>
      <p>All employees are provided corporate workstations and access credentials strictly for business purposes. Confidential client records and intellectual property must be handled according to ISO 27001 security guidelines.</p>

      <h2>4. Work Arrangements & Paid Leave</h2>
      <table>
        <thead>
          <tr>
            <th>Benefit Category</th>
            <th>Standard Allocation</th>
            <th>Approval Protocol</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Paid Time Off (PTO)</td>
            <td>25 Days Annually</td>
            <td>Manager Approval via HR Portal</td>
          </tr>
          <tr>
            <td>Professional Development</td>
            <td>$2,500 Annual Stipend</td>
            <td>Department Head Sign-off</td>
          </tr>
          <tr>
            <td>Health & Wellness</td>
            <td>Comprehensive Medical & Dental</td>
            <td>Automatic Enrollment</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'academic-paper',
    name: 'Academic Research Manuscript',
    description: 'Standard scholarly paper formatting with abstract, introduction, methodology, and citations.',
    category: 'Academic',
    icon: 'BookOpen',
    contentHtml: `
      <h1>Comparative Performance Analysis of WebAssembly vs. Native Desktop Runtimes</h1>
      <p><strong>Dr. Evelyn Vance, PhD</strong><br /><em>Department of Computer Science, Institute of Advanced Technology</em><br />evelyn.vance@iat.edu</p>
      
      <h2>Abstract</h2>
      <p>This paper examines the computational latency, memory footprint, and operating system integration of contemporary cross-platform application runtimes. We present empirical benchmarks comparing WebAssembly execution engines against Rust-compiled native desktop applications, highlighting optimizations in multi-threaded document layout rendering.</p>
      <hr />

      <h2>1. Introduction</h2>
      <p>Modern desktop software architectures increasingly balance cross-platform developer velocity with native operating system responsiveness. The emergence of lightweight desktop frameworks combining native operating system webviews with system-level backends offers a compelling alternative to traditional heavy runtimes.</p>

      <h2>2. Methodology & Test Setup</h2>
      <p>All benchmarks were executed in an isolated Linux environment (x86_64, 16 vCPUs, 32GB RAM). Performance metrics measured include time-to-first-paint (TTFP), peak memory usage during large document parsing (500+ pages), and typography layout reflow duration.</p>

      <h2>3. Key Findings</h2>
      <ul>
        <li>Native bindings achieved a 42% reduction in memory overhead compared to legacy single-threaded web runtimes.</li>
        <li>Incremental layout reflows showed sub-16ms response times consistently across all tested document structures.</li>
      </ul>
    `,
  },
];
