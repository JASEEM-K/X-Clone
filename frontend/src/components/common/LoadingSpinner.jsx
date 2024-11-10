import PropTypes from 'prop-types';            

const LoadingSpinner = ({ size }) => {
    const sizeClass = `loading-${size}`;
    return <span className={`loading loading-spinner ${sizeClass}`} />
};
export default LoadingSpinner;

LoadingSpinner.propTypes = {
    size: PropTypes.string,
    isLoading: PropTypes.bool,
}
LoadingSpinner.defaultProps = {
    size: "md",
}