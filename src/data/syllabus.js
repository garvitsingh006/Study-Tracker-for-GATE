export const PAPERS = { CSE: 'CSE', DSAI: 'DSAI' }

const SYLLABUS = [
  {
    id: 'em',
    name: 'Engineering Mathematics',
    topics: [
      {
        id: 'em-prob',
        name: 'Probability & Statistics',
        subtopics: [
          { id: 'em-prob-1', name: 'Probability Axioms, Sample Space, Events, Independent Events, Mutually Exclusive Events', papers: ['DSAI'] },
          { id: 'em-prob-2', name: 'Conditional Probability, Bayes Theorem', papers: ['CSE', 'DSAI'] },
          { id: 'em-prob-3', name: 'Random Variables, Discrete & Continuous, PMF, PDF, CDF', papers: ['CSE', 'DSAI'] },
          { id: 'em-prob-4', name: 'Uniform, Normal, Exponential, Poisson, Binomial Distributions', papers: ['CSE', 'DSAI'] },
          { id: 'em-prob-5', name: 'Mean, Median, Mode, Standard Deviation, Variance, Expectation', papers: ['CSE', 'DSAI'] },
          { id: 'em-prob-6', name: 'Correlation, Covariance, Joint Probability', papers: ['DSAI'] },
          { id: 'em-prob-7', name: 'Bernoulli, Standard Normal, t-distribution, Chi-squared distributions', papers: ['DSAI'] },
          { id: 'em-prob-8', name: 'Central Limit Theorem, Confidence Interval, z-test, t-test, chi-squared test', papers: ['DSAI'] },
          { id: 'em-prob-9', name: 'Counting (Permutation and Combinations)', papers: ['DSAI'] }
        ],
      },
      {
        id: 'em-la',
        name: 'Linear Algebra',
        subtopics: [
          { id: 'em-la-1', name: 'Matrices, Determinants', papers: ['CSE', 'DSAI'] },
          { id: 'em-la-2', name: 'System of Linear Equations', papers: ['CSE', 'DSAI'] },
          { id: 'em-la-3', name: 'Eigenvalues and Eigenvectors', papers: ['CSE', 'DSAI'] },
          { id: 'em-la-4', name: 'LU Decomposition', papers: ['CSE', 'DSAI'] },
          { id: 'em-la-5', name: 'Vector Space, Subspaces, Linear Dependence & Independence', papers: ['DSAI'] },
          { id: 'em-la-6', name: 'Projection, Orthogonal, Idempotent, Partition Matrices', papers: ['DSAI'] },
          { id: 'em-la-7', name: 'Quadratic Forms, Rank, Nullity', papers: ['DSAI'] },
          { id: 'em-la-8', name: 'Singular Value Decomposition (SVD)', papers: ['DSAI'] },
        ],
      },
      {
        id: 'em-calc',
        name: 'Calculus & Optimization',
        subtopics: [
          { id: 'em-calc-1', name: 'Limits, Continuity and Differentiability', papers: ['CSE', 'DSAI'] },
          { id: 'em-calc-2', name: 'Maxima and Minima', papers: ['CSE', 'DSAI'] },
          { id: 'em-calc-3', name: 'Mean Value Theorem, Integration', papers: ['CSE'] },
          { id: 'em-calc-4', name: 'Taylor Series, Functions of a single variable', papers: ['DSAI'] },
          { id: 'em-calc-5', name: 'Optimization involving a single variable', papers: ['DSAI'] }
        ],
      },
      {
        id: 'em-dm',
        name: 'Discrete Mathematics',
        subtopics: [
          { id: 'em-dm-1', name: 'Propositional and First Order Logic', papers: ['CSE'] },
          { id: 'em-dm-2', name: 'Sets, Relations, Functions, Partial Orders, Lattices', papers: ['CSE'] },
          { id: 'em-dm-3', name: 'Monoids, Groups', papers: ['CSE'] },
          { id: 'em-dm-4', name: 'Graphs: Connectivity, Matching, Colouring', papers: ['CSE'] },
          { id: 'em-dm-5', name: 'Combinatorics: Counting, Recurrence Relations, Generating Functions', papers: ['CSE'] },
        ],
      },
    ],
  },
  {
    id: 'pds',
    name: 'Programming, Data Structures & Algorithms',
    topics: [
      {
        id: 'pds-prog',
        name: 'Programming',
        subtopics: [
          { id: 'pds-prog-1', name: 'Programming in C', papers: ['CSE'] },
          { id: 'pds-prog-2', name: 'Programming in Python', papers: ['DSAI'] },
          { id: 'pds-prog-3', name: 'Recursion', papers: ['CSE'] },
        ],
      },
      {
        id: 'pds-ds',
        name: 'Data Structures',
        subtopics: [
          { id: 'pds-ds-1', name: 'Arrays, Stacks, Queues', papers: ['CSE', 'DSAI'] },
          { id: 'pds-ds-2', name: 'Linked Lists, Trees', papers: ['CSE', 'DSAI'] },
          { id: 'pds-ds-3', name: 'Binary Search Trees, Heaps', papers: ['CSE'] },
          { id: 'pds-ds-4', name: 'Graphs', papers: ['CSE'] },
          { id: 'pds-ds-5', name: 'Hash Tables', papers: ['DSAI'] },
        ],
      },
      {
        id: 'pds-algo',
        name: 'Algorithms',
        subtopics: [
          { id: 'pds-algo-1', name: 'Searching, Sorting, Hashing', papers: ['CSE'] },
          { id: 'pds-algo-2', name: 'Linear & Binary Search', papers: ['DSAI'] },
          { id: 'pds-algo-3', name: 'Selection, Bubble, Insertion, Merge, Quick Sort', papers: ['DSAI'] },
          { id: 'pds-algo-4', name: 'Asymptotic Worst Case Time & Space Complexity', papers: ['CSE'] },
          { id: 'pds-algo-5', name: 'Greedy, Dynamic Programming', papers: ['CSE'] },
          { id: 'pds-algo-6', name: 'Divide and Conquer', papers: ['CSE', 'DSAI'] },
          { id: 'pds-algo-7', name: 'Graph Theory Intro, Traversals, Shortest Paths', papers: ['CSE', 'DSAI'] },
          { id: 'pds-algo-8', name: 'Minimum Spanning Trees', papers: ['CSE'] },
        ],
      },
    ],
  },
  {
    id: 'db',
    name: 'Database Management',
    topics: [
      {
        id: 'db-core',
        name: 'Core Databases',
        subtopics: [
          { id: 'db-core-1', name: 'ER-Model', papers: ['CSE', 'DSAI'] },
          { id: 'db-core-2', name: 'Relational Model, Relational Algebra, Tuple Calculus, SQL', papers: ['CSE', 'DSAI'] },
          { id: 'db-core-3', name: 'Integrity Constraints, Normal Forms', papers: ['CSE', 'DSAI'] },
          { id: 'db-core-4', name: 'File Organization, Indexing (e.g. B and B+ trees)', papers: ['CSE', 'DSAI'] },
          { id: 'db-core-5', name: 'Transactions and Concurrency Control', papers: ['CSE'] },
          { id: 'db-core-6', name: 'Data Types', papers: ['DSAI'] },
        ],
      },
      {
        id: 'db-dw',
        name: 'Data Warehousing',
        subtopics: [
          { id: 'db-dw-1', name: 'Data Transformation (Normalization, Discretization, Sampling, Compression)', papers: ['DSAI'] },
          { id: 'db-dw-2', name: 'Data Warehouse Modelling (Schema, Concept Hierarchies, Measures)', papers: ['DSAI'] },
        ],
      },
    ],
  },
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence & Machine Learning',
    topics: [
      {
        id: 'ml-sup',
        name: 'Supervised Learning',
        subtopics: [
          { id: 'ml-sup-1', name: 'Regression and Classification Problems', papers: ['DSAI'] },
          { id: 'ml-sup-2', name: 'Simple & Multiple Linear Regression, Ridge, Logistic Regression', papers: ['DSAI'] },
          { id: 'ml-sup-3', name: 'K-Nearest Neighbour, Naive Bayes Classifier', papers: ['DSAI'] },
          { id: 'ml-sup-4', name: 'Linear Discriminant Analysis, Support Vector Machine', papers: ['DSAI'] },
          { id: 'ml-sup-5', name: 'Decision Trees', papers: ['DSAI'] },
          { id: 'ml-sup-6', name: 'Bias-Variance Trade-off', papers: ['DSAI'] },
          { id: 'ml-sup-7', name: 'Cross-Validation (LOO, k-folds)', papers: ['DSAI'] },
          { id: 'ml-sup-8', name: 'Multi-layer Perceptron, Feed-forward Neural Network', papers: ['DSAI'] },
        ],
      },
      {
        id: 'ml-unsup',
        name: 'Unsupervised Learning',
        subtopics: [
          { id: 'ml-unsup-1', name: 'Clustering Algorithms (K-means/K-medoid, Hierarchical)', papers: ['DSAI'] },
          { id: 'ml-unsup-2', name: 'Top-down, Bottom-up: Single/Multiple-linkage', papers: ['DSAI'] },
          { id: 'ml-unsup-3', name: 'Dimensionality Reduction, Principal Component Analysis', papers: ['DSAI'] },
        ],
      },
      {
        id: 'ai-core',
        name: 'Artificial Intelligence',
        subtopics: [
          { id: 'ai-core-1', name: 'Search: Informed, Uninformed, Adversarial', papers: ['DSAI'] },
          { id: 'ai-core-2', name: 'Logic, Propositional, Predicate', papers: ['DSAI'] },
          { id: 'ai-core-3', name: 'Reasoning under Uncertainty, Conditional Independence Representation', papers: ['DSAI'] },
          { id: 'ai-core-4', name: 'Exact Inference (Variable Elimination), Approximate Inference (Sampling)', papers: ['DSAI'] },
        ],
      },
    ],
  },
  {
    id: 'cse-core',
    name: 'Core Computer Science',
    topics: [
      {
        id: 'core-dl',
        name: 'Digital Logic',
        subtopics: [
          { id: 'core-dl-1', name: 'Boolean Algebra. Minimization', papers: ['CSE'] },
          { id: 'core-dl-2', name: 'Combinational and Sequential Circuits', papers: ['CSE'] },
          { id: 'core-dl-3', name: 'Number Representations and Computer Arithmetic', papers: ['CSE'] },
        ]
      },
      {
        id: 'core-coa',
        name: 'Computer Organization & Architecture',
        subtopics: [
          { id: 'core-coa-1', name: 'Machine Instructions and Addressing Modes', papers: ['CSE'] },
          { id: 'core-coa-2', name: 'ALU, Data-path and Control Unit', papers: ['CSE'] },
          { id: 'core-coa-3', name: 'Instruction Pipelining, Pipeline Hazards', papers: ['CSE'] },
          { id: 'core-coa-4', name: 'Memory Hierarchy: Cache, Main Memory, Secondary Storage', papers: ['CSE'] },
          { id: 'core-coa-5', name: 'I/O Interface (Interrupt and DMA mode)', papers: ['CSE'] },
        ]
      },
      {
        id: 'core-toc',
        name: 'Theory of Computation',
        subtopics: [
          { id: 'core-toc-1', name: 'Regular Expressions and Finite Automata', papers: ['CSE'] },
          { id: 'core-toc-2', name: 'Context-free Grammars and Push-down Automata', papers: ['CSE'] },
          { id: 'core-toc-3', name: 'Regular and Context-free Languages, Pumping Lemma', papers: ['CSE'] },
          { id: 'core-toc-4', name: 'Turing Machines and Undecidability', papers: ['CSE'] },
        ]
      },
      {
        id: 'core-cd',
        name: 'Compiler Design',
        subtopics: [
          { id: 'core-cd-1', name: 'Lexical Analysis, Parsing, Syntax-directed Translation', papers: ['CSE'] },
          { id: 'core-cd-2', name: 'Runtime Environments. Intermediate Code Generation', papers: ['CSE'] },
          { id: 'core-cd-3', name: 'Local Optimization, Data Flow Analyses', papers: ['CSE'] },
        ]
      },
      {
        id: 'core-os',
        name: 'Operating System',
        subtopics: [
          { id: 'core-os-1', name: 'System Calls, Processes, Threads, Inter-process Communication', papers: ['CSE'] },
          { id: 'core-os-2', name: 'Concurrency and Synchronization. Deadlock', papers: ['CSE'] },
          { id: 'core-os-3', name: 'CPU and I/O Scheduling', papers: ['CSE'] },
          { id: 'core-os-4', name: 'Memory Management and Virtual Memory. File Systems', papers: ['CSE'] },
        ]
      },
      {
        id: 'core-cn',
        name: 'Computer Networks',
        subtopics: [
          { id: 'core-cn-1', name: 'OSI and TCP/IP Protocol Stacks. Layering', papers: ['CSE'] },
          { id: 'core-cn-2', name: 'Packet, Circuit and Virtual Circuit Switching', papers: ['CSE'] },
          { id: 'core-cn-3', name: 'Data Link Layer: Framing, Error Detection, MAC, Ethernet Bridging', papers: ['CSE'] },
          { id: 'core-cn-4', name: 'Routing Protocols: Shortest Path, Flooding, Distance Vector, Link State', papers: ['CSE'] },
          { id: 'core-cn-5', name: 'Fragmentation and IP Addressing, IPv4, CIDR Notation', papers: ['CSE'] },
          { id: 'core-cn-6', name: 'IP Support Protocols (ARP, DHCP, ICMP), NAT', papers: ['CSE'] },
          { id: 'core-cn-7', name: 'Transport Layer: Flow & Congestion Control, UDP, TCP, Sockets', papers: ['CSE'] },
          { id: 'core-cn-8', name: 'Application Layer: DNS, SMTP, HTTP, FTP, Email', papers: ['CSE'] },
        ]
      }
    ]
  }
]

export default SYLLABUS
