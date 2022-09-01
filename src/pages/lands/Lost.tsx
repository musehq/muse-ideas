import dynamic from "next/dynamic";

const DeveloperReality = dynamic(import("realities/DeveloperReality"), {
  ssr: false,
});
const Idea = dynamic(import("ideas/lands/Lost"), {
  ssr: false,
});

export default () => (
  <DeveloperReality>
    <Idea />
  </DeveloperReality>
);
