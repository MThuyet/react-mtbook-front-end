import BookDetail from "@/components/client/book/book.detail"
import { useParams } from "react-router-dom"

const BookPage = () => {
	let { id } = useParams();

	return (
		<div>
			<BookDetail />
		</div>
	)
}

export default BookPage
