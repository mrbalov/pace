import { Button } from '@geist-ui/core';
import ChevronDown from '@geist-ui/icons/chevronDown';
import ChevronUp from '@geist-ui/icons/chevronUp';

interface ExpanderProps {
  isExpanded: boolean;
  withButton: boolean;
  handleToggleExpand: (event: React.MouseEvent) => void;
}

/**
 * Expander for the expandable card.
 * @param {ExpanderProps} props - Expander props.
 * @param {boolean} props.isExpanded - Whether the card is expanded.
 * @param {boolean} props.withButton - Whether to display the toggle button.
 * @param {Function} props.handleToggleExpand - Function to toggle the expanded state.
 * @returns {JSX.Element} Expander component.
 */
const Expander = ({
  isExpanded,
  withButton,
  handleToggleExpand,
}: ExpanderProps) => (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50px',
      background: isExpanded
        ? 'transparent'
        : 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.75))',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '4px 0',
    }}
  >
    {withButton && (
      <Button
        auto
        ghost
        scale={0.1}
        type="default"
        icon={isExpanded ? <ChevronUp /> : <ChevronDown />}
        onClick={handleToggleExpand}
        onPointerEnterCapture={() => undefined}
        onPointerLeaveCapture={() => undefined}
        placeholder="Toggle"
      />
    )}
  </div>
);

export default Expander;
