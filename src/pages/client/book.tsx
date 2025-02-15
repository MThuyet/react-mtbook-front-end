import BookDetail from "@/components/client/book/book.detail"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBookDetailAPI } from "@/services/api";
import BookLoader from "@/components/client/book/book.loader";

const BookPage = () => {
	let { id } = useParams();
	const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchBookDetail = async () => {
			setIsLoading(true);
			const res = await getBookDetailAPI(id as string);
			if (res && res.data) {
				setCurrentBook(res.data);
			}
			setIsLoading(false);
		}
		fetchBookDetail();
	}, [id]);

	return (
		<div>
			{isLoading
				? <BookLoader />
				: <BookDetail currentBook={currentBook} />
			}

		</div>
	)
}

export default BookPage
