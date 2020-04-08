export function getHits(response: any) {
  // console.log('hits: ', response.data)
  return response.data.hits.hits.map((h: any) => { return { ...h._source, _id: h._id } })
}
