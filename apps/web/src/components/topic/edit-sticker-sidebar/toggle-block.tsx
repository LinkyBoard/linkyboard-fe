import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec, ToggleWrapper } from "@blocknote/react";

const ToggleBlock = createReactBlockSpec(
  {
    type: "toggleListItem",
    propSchema: {
      ...defaultProps,
    },
    content: "inline",
  },
  {
    render: (props) => (
      <ToggleWrapper block={props.block} editor={props.editor}>
        <p ref={props.contentRef} />
      </ToggleWrapper>
    ),
  }
);

export default ToggleBlock;
