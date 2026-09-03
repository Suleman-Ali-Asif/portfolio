export type NodeType = "client" | "server" | "database" | "external";

export interface NodeDef {
  id: string;
  label: string;
  sublabel: string;
  type: NodeType;
  x: number;
  y: number;
  tooltip: string;
}

export interface EdgeDef {
  from: string;
  to: string;
  label: string;
  bidirectional: boolean;
}

export interface Architecture {
  summary: string;
  nodes: NodeDef[];
  edges: EdgeDef[];
}

export interface ProjectItem {
  slug: string;
  name: string;
  image: string;
  /** optional dark-theme variant of `image` */
  imageDark?: string;
  description: string;
  stack: string[];
  url?: string;
  problem?: string;
  whatIBuilt?: string[];
  engineeringWork?: string[];
  impact?: string[];
  requestFlow?: string[];
  architecture?: Architecture;
}
