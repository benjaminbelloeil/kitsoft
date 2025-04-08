import styles from './page.module.css'


const feedbacks: Feedback[] = [
	{
		id: "fb1",
		author: "Ana Martínez",
		message: "Me encantó la rapidez con la que entregaron el proyecto. ¡Súper recomendados!",
		projectName: "Landing Page - Glass Company",
		date: new Date("2025-03-21")
	},
	{
		id: "fb2",
		author: "Luis Hernández",
		message: "El diseño fue justo lo que buscábamos. Gran atención al detalle.",
		projectName: "E-commerce - Retro Sneakers",
		date: new Date("2025-03-30")
	},
	{
		id: "fb3",
		author: "Carmen Soto",
		message: "Hubo buena comunicación durante todo el proceso. Muy profesionales.",
		projectName: "Blog - Café con Código",
		date: new Date("2025-04-02")
	},
	{
		id: "fb4",
		author: "José Ramírez",
		message: "Hubo algunos retrasos pero el resultado final fue excelente.",
		projectName: "App de reservas - FitDojo",
		date: new Date("2025-03-25")
	},
	{
		id: "fb5",
		author: "Valeria Gómez",
		message: "Superó nuestras expectativas, especialmente en versión móvil.",
		projectName: "Portfolio - Art by Vale",
		date: new Date("2025-04-05")
	}
];

export default function FeedbackBoard() {
	return (
		<div className={styles['feedback-board']}>
			{feedbacks.map(item => {
				return (
				<FeedbackMessage
					key={item.id}
					id={item.id}
					author={item.author}
					message={item.message}
					projectName={item.projectName}
					date={item.date}
				/>
				)
			})}
		</div>
	)
}

interface Feedback {
	id: string
	author: string,
	message: string,
	projectName: string,
	date: Date
}
function FeedbackMessage({author, message, projectName, date}: Feedback) {
	return (
		<div className={styles['feedback-container']}>
			<h3 className={styles['date']}>{date.toDateString()}</h3>
			<p className={styles['message']}>{message}</p>
			<h2 className={styles['author']}>{author}</h2>
			<h3 className={styles['project']}>{projectName}</h3>
		</div>
	)
}