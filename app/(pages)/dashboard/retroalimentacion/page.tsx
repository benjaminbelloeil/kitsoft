
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from './page.module.css'


const feedbacks: Feedback[] = [
	{
		id: "fb1",
		author: "Ana Martínez",
		message: "Me encantó la rapidez con la que entregaron el proyecto. ¡Súper recomendados!",
		projectName: "Landing Page - Glass Company",
		date: new Date("2025-03-21"),
		color: '#3d64b3'
	},
	{
		id: "fb2",
		author: "Luis Hernández",
		message: "El diseño fue justo lo que buscábamos. Gran atención al detalle.",
		projectName: "E-commerce - Retro Sneakers",
		date: new Date("2025-03-30"),
		color: '#3db36c'
	},
	{
		id: "fb3",
		author: "Carmen Soto",
		message: "Hubo buena comunicación durante todo el proceso. Muy profesionales.",
		projectName: "E-commerce - Retro Sneakers",
		date: new Date("2025-04-02"),
		color: '#3db36c'
	},
	{
		id: "fb4",
		author: "José Ramírez",
		message: "Hubo algunos retrasos pero el resultado final fue excelente.",
		projectName: "App de reservas - FitDojo",
		date: new Date("2025-03-25"),
		color: 'var(--accenture-purple)'
	},
	{
		id: "fb5",
		author: "Valeria Gómez",
		message: "Superó nuestras expectativas, especialmente en versión móvil.",
		projectName: "E-commerce - Retro Sneakers",
		date: new Date("2025-04-05"),
		color: '#3db36c'
	}
];

export default function FeedbackBoard() {
	return (
		<div className={styles['feedback-board']}>
			<FeedbackHeader />
			<div className={styles['feedback-wrapper']}>
				{feedbacks.map(item => {
					return (
					<FeedbackMessage
						key={item.id}
						id={item.id}
						author={item.author}
						message={item.message}
						projectName={item.projectName}
						date={item.date}
						color={item.color}
					/>
					)
				})}
			</div>
		</div>
	)
}

function FeedbackHeader({}) {
	return (
		<div className={styles['header-wrapper']}>
			<h1 className={styles['header']}>Mi Feedback</h1>
			<div className={styles['metrics']}>
				<ProjectMetric name={'Glass Company'} messageNumber={1} />
				<ProjectMetric name={'Retro Sneakers'} messageNumber={3} />
				<ProjectMetric name={'Fit Dojo'} messageNumber={1} />
			</div>

		</div>
	)
}

function ProjectMetric({name, messageNumber}: {name: string, messageNumber: number}) {
	return (
		<div className={styles['metric-wrapper']}>
			<h2 className={styles['project-name']}>{name}</h2>
			<h3 className={styles['message-number']}>{messageNumber}</h3>
		</div>
	)
}

export function FeedbackSearchBar({}) {
	return (
		<div className={styles['search-bar']}>
			<input type="text" placeholder='Buscar'/>

		</div>
	)
}

interface Feedback {
	id: string
	author: string,
	message: string,
	projectName: string,
	date: Date
	color: string
}
function FeedbackMessage({author, message, projectName, date, color}: Feedback) {
	return (
		<div className={styles['feedback-message']} style={{borderColor: color}}>
			<div className={styles['content']}>
				<h3 className={styles['date']}>{date.toDateString()}</h3>
				<p className={styles['message']}>{`"${message}"`}</p>
			</div>
			<div className={styles['footer']}>
				<h2 className={styles['author']}>{author}</h2>
				<h3 className={styles['project']}>{projectName}</h3>
			</div>
		</div>
	)
}

