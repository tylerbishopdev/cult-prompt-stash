import Image from "next/image"

export function CultLogo(props: any) {
  return (
    <Image
      className="object-fill"
      src="/Vector.png"
      alt="Cult Logo"
      width={900}
      height={300}
      {...props}
    />
  )
}
