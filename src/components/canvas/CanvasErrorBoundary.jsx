import { Component } from "react";
import PropTypes from "prop-types";

// Catches any runtime three.js/r3f failure (not just "no WebGL support" —
// also a corrupt asset, a context loss, etc.) so it degrades to the
// fallback UI instead of taking down the whole React tree.
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("3D scene failed to render, falling back:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

CanvasErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  // Intentionally not `.isRequired` — `null` (render nothing on error) is a
  // valid, commonly-used fallback value, not a missing prop.
  fallback: PropTypes.node,
};

export default CanvasErrorBoundary;
