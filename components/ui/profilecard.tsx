import Link from 'next/link'

interface ProfileCardProps {
    title: string,
    text: string,
    icon: string,
    link:string,
}

const profilecard = (props: ProfileCardProps) => {
  return (
    <Link href={props.link} className="flex items-center justify-between bg-white rounded-lg p-4">
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-(--primary)/10 text-(--primary)">
                <span className="material-symbols-outlined">{props.icon}</span>
            </div>
            <div>
                <h4 className="font-bold text-lg">{props.title}</h4>
                <p className="text-(--ash) text-sm">{props.text}</p>
            </div>
        </div>
        <div>
            <span className="material-symbols-outlined text-(--ash)">keyboard_arrow_right</span>
        </div>
    </Link>
  )
}

export default profilecard