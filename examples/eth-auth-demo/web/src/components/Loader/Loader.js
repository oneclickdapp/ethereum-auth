import { useSpring, animated } from 'react-spring'

const Loader = () => {
  const [flip, set] = React.useState(false)
  const props = useSpring({
    to: { height: '6rem' },
    from: { height: '8rem' },
    reset: true,
    reverse: flip,
    onRest: () => set(!flip),
  })
  return (
    <div className="w-min-screen h-min-screen">
      <animated.img style={props} src="/logo.png" />
    </div>
  )
}

export default Loader
