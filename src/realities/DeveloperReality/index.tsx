import { Children, cloneElement, isValidElement, ReactNode } from "react";
import Develop, { DevelopConsumer } from "./layers/Develop";
import Debug from "./layers/Debug";

type DeveloperRealityProps = {
  children: ReactNode | ReactNode[];
};

export default function DeveloperReality(props: DeveloperRealityProps) {
  const { children } = props;

  const appliedChild = (child: ReactNode, props: any) => {
    {
      // Checking isValidElement is the safe way and avoids a typescript
      // error too.
      if (isValidElement(child)) {
        return cloneElement(child, props);
      }
      return child;
    }
  };

  return (
    <Develop>
      <Debug>
        <DevelopConsumer>
          {(value) =>
            Children.map(children, (child) => appliedChild(child, value.config))
          }
        </DevelopConsumer>
      </Debug>
    </Develop>
  );
}
