export function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-green-200 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-200 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-yellow-200 rounded-full blur-xl"></div>
    </div>
  )
}
