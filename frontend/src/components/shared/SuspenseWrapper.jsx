import { Suspense } from "react";

/* eslint-disable no-unused-vars */
const SuspenseWrapper = (Component) => (
  <Suspense  fallback={<div className="p-8">Loading.....</div>}>
    <Component />
  </Suspense>
);

export default SuspenseWrapper;
