import React from "react";
class ErrorBoundary extends React.Component<any, any> {
  state = { error: null };
  static getDerivedStateFromError(error: any) { return { error }; }
  render() { if (this.state.error) return <div style={{background:'white',color:'red',padding:20}}><h1>Error:</h1><pre>{String(this.state.error)} {String(this.state.error?.stack || '')}</pre></div>; return this.props.children; }
}
function SafeApp() {
  const [msg, setMsg] = React.useState("Loading...");
  React.useEffect(()=>{ setMsg("App Loaded"); },[]);
  return <div style={{background:'white',color:'black',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}><h1>ONEFEED V17 DEBUG</h1><p>{msg}</p><button onClick={()=>{try{ const mod = require('./components/TopBar'); setMsg("TopBar exists: "+!!mod.TopBar)}catch(e:any){setMsg("TopBar Error: "+e.message)}}}>Test TopBar</button></div>;
}
export default function App(){ return <ErrorBoundary><SafeApp/></ErrorBoundary> }
