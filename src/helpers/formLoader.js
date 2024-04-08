import React from "react"
import ContentLoader from "react-content-loader"

const formLoader = (props) => (
  <ContentLoader 
    speed={1}
    width={1000}
    height={400}
    viewBox="0 0 800 500"
    backgroundColor="#f3f3f3"
    foregroundColor="#c4c4c4"
    {...props}
  >
    <rect x="10" y="100" rx="0" ry="0" width="149" height="9" /> 
    <rect x="3" y="37" rx="5" ry="5" width="347" height="41" /> 
    <rect x="376" y="40" rx="5" ry="5" width="196" height="106" /> 
    <rect x="7" y="144" rx="0" ry="0" width="149" height="9" /> 
    <rect x="7" y="189" rx="0" ry="0" width="149" height="9" /> 
    <rect x="9" y="236" rx="0" ry="0" width="149" height="9" /> 
    <rect x="5" y="281" rx="0" ry="0" width="149" height="9" /> 
    <rect x="7" y="327" rx="0" ry="0" width="149" height="9" /> 
    <rect x="7" y="372" rx="0" ry="0" width="149" height="9" /> 
    <rect x="195" y="98" rx="0" ry="0" width="149" height="9" /> 
    <rect x="192" y="142" rx="0" ry="0" width="149" height="9" /> 
    <rect x="192" y="187" rx="0" ry="0" width="149" height="9" /> 
    <rect x="194" y="234" rx="0" ry="0" width="149" height="9" /> 
    <rect x="190" y="279" rx="0" ry="0" width="149" height="9" /> 
    <rect x="192" y="325" rx="0" ry="0" width="149" height="9" /> 
    <rect x="192" y="370" rx="0" ry="0" width="149" height="9" /> 
    <rect x="6" y="419" rx="0" ry="0" width="94" height="33" />
  </ContentLoader>
)

export default formLoader