import { ReactNode } from "react"

const layout = ({children} : {children: ReactNode}) => {
  return (
    <div className="bg-(--background) min-h-screen">{children}</div>
  )
}

export default layout