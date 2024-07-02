declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.css?url" {
  const content: string;
  export default content;
}

declare module 'html-react-parser' {
  import { ReactElement } from 'react';
  export default function ReactHtmlParser(html: string): ReactElement;
}
