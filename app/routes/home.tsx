import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumey.io" },
    { name: "description", content: "Unlock your career potential!" },
  ];
}

export default function Home() {
  return <main></main>;
}
