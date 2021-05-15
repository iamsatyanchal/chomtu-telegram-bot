import { fetchHTML } from './';

const randomNumber = (max) => {
	return Math.floor(Math.random() * max - 1);
}

export default async function fetch (query) {
	try {
		let images = [];
		const imageData = await fetchHTML(`https://www.dogpile.com/serp?qc=images&q=${query}`);
		imageData(".image > a > img").each((i, img) => {
			images.push(imageData(img).attr("src"));
		})

		const imageNumber = randomNumber(images.length);
		const image = await images[imageNumber]

		return ({
			"status": "success",
			"data": image,
			"url": image
		})

	} catch (e) {
	    console.log(e.message)
		return {"status": "fail", "msg": e.message}
	}
}