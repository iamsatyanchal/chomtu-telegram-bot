import { fetchHTML } from './';

const randomNumber = (max) => {
	return Math.floor(Math.random() * max - 1);
}

export default async function getImage (query) {
	try {
		let images = [];
		const imageData = await fetchHTML(`https://www.dogpile.com/serp?qc=images&q=${query}&sc=O9824CiY0HrT20`);
		imageData(".image > a > img").each((i, img) => {
			images.push(imageData(img).attr("src"));
		})

		const imageNumber = randomNumber(images.length);
		let image = await images[imageNumber]

		if (!image) {
			image = await images[randomNumber(images.length)]
		}

		return ({
			"status": "success",
			"data": image,
			"url": image
		})

	} catch (e) {
	    console.log(e);
		return {"status": "fail", "msg": e.message}
	}
}