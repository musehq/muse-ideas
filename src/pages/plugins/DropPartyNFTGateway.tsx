import dynamic from "next/dynamic";

const DeveloperReality = dynamic(import("realities/DeveloperReality"), {
  ssr: false,
});
const Idea = dynamic(import("ideas/plugins/DropPartyNFTGateway"), {
  ssr: false,
});

export default () => (
  <DeveloperReality>
    <Idea />
  </DeveloperReality>
);
