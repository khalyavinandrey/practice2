import { pipe, split, apply, path, pathOr } from 'ramda';
import pLimit from "p-limit";

const asyncLimit = pLimit(50);

const releasesUrls = [
    "https://musicbrainz.org/ws/2/release/5cffd7d1-35f9-4c08-a1ab-9b6d3f2d2492?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/380ebaf0-c4f4-47e9-88f1-4e436692e2d1?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/c68a3335-80b8-448a-9fdd-a1ac2cf6967c?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/02f7e348-b1ae-4c4e-a057-b97f1f56e53c?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/9e7dd586-814e-4ba7-ab18-5b3e554b38a7?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/bc2b7291-11f1-4307-8191-df5639f96207?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/6ab7f556-8542-487d-833f-1fb63446a8d8?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/7a041b0e-dd4e-4598-914b-733c3331f4e2?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/98cde1bf-1c4d-4658-a2b8-9dd9ffacf8a2?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/7db95535-b487-47f8-8889-fbf4358518b6?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/8f5d5cb9-c030-4bdb-8f0f-84d93f57b532?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/3d13a89a-e98b-4e46-afad-c67ad59724ff?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/7b4d84ae-1c36-4a34-a7b4-c1d41899c0d1?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/a5232981-a53b-41e3-bc93-ec095d69e37e?fmt=json&inc=recordings+release-groups+artists",
    "https://musicbrainz.org/ws/2/release/40a7080b-40e4-3b24-847a-d21aaee5f414?fmt=json&inc=recordings+release-groups+artists",
]

const authorUrlEx =     "https://musicbrainz.org/ws/2/artist/83d91898-7763-47d7-b03b-b92132375c47?fmt=json&inc=release-groups"

    const authorUrls = [
    "https://musicbrainz.org/ws/2/artist/83d91898-7763-47d7-b03b-b92132375c47?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/9fff2f8a-21e6-47de-a2b8-7f449929d43f?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/b95ce3ff-3d05-4e87-9e01-c97b66af13d4?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/650e7db6-b795-4eb5-a702-5ea2fc46c848?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/859d0860-d480-4efd-970c-c05d5f1776b8?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/9118f524-be76-4eaf-875c-ccf15e2a2ad6?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/f422e97e-fe40-4c9c-be9a-2bba923539ad?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/dc453ee9-f2d4-4582-840b-b3be6c79654d?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/d87c14ef-f570-470d-be76-3e2023fa4f61?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/93d62249-3825-405d-af4b-08d4b3b89f61?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/f59c5520-5f46-4d2c-b2c4-822eabf53419?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/012151a8-0f9a-44c9-997f-ebd68b5389f9?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/16a43d5e-c52d-4eaa-9c3b-00b2c1d8e816?fmt=json&inc=release-groups",
    "https://musicbrainz.org/ws/2/artist/0783b768-6719-450b-a7e1-7e891da17af3?fmt=json&inc=release-groups",
]

class Album {
    title: string | undefined
    date: Date | undefined

    constructor(
        jsonData: any
    ) {
        this.title = path(["title"], jsonData);
        this.date = new Date(path(["first-release-date"], jsonData));
    }
}

async function fetchAndGetResponse(url: string) {
    try {
        const response = await asyncLimit(() => fetch(url))

        return response.json()
    } catch (e) {
        console.log(`Не удалось получить данные по существующему адресу: ${url}`)
    }
}

function getAverageLengthFromDisk(media: never) {
    const tracks = pathOr([], ["tracks"], media)

    return tracks
        .map(track => path(["length"], track))
        .reduce((acc, val) => acc + val, 0) / tracks.length
}

async function getInfoAboutReleases(url: string) {
    const response = await fetchAndGetResponse(url);

    const listOfMedia = pathOr([], ["media"], response)

    const avgLengthOfRelease = listOfMedia
        .map(media => {
            const avgLength = getAverageLengthFromDisk(media)

            console.log(
                `average length of media with title "${path(["title"], media)}" from release "${path(["title"], response)}" is: ${avgLength}`
            )

            return avgLength
        })
        .reduce((acc, val) => acc + val, 0) / listOfMedia.length

    console.log(
        `average length of release with title "${path(["title"], response)}" is: ${avgLengthOfRelease}`
    )
}

async function getInfoAboutArtists(url: string) {
    const response = await fetchAndGetResponse(url)

    const listOfAlbums = pathOr([], ["release-groups"], response)

    return listOfAlbums
        .filter(album => path(["secondary-types"], album) != "Compilation")
        .map(album => new Album(album))
        .sort((a, b) => a.date?.getTime()!! - b.date?.getTime()!!)
        .forEach(album => {
            console.log(`album: ${album.title}, date: ${album.date?.toDateString()}`)
        })
}

(async () => {
    for (const url of releasesUrls) {
        await getInfoAboutReleases(url)
    }

    setTimeout(async () => {
        await getInfoAboutArtists(authorUrlEx)
    }, 1000); // таймаут 1 сек
})();