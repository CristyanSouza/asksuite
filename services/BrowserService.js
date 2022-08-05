const puppeteer = require('puppeteer')

const crawling = async (checkin, checkout) => {
  const URL = `https://pratagy.letsbook.com.br/D/Reserva?checkin=${checkin[0]}%2F${checkin[1]}%2F${checkin[2]}&checkout=${checkout[0]}%2F${checkout[1]}%2F${checkout[2]}&cidade=&hotel=12&adultos=2&criancas=&destino=Pratagy+Beach+Resort+All+Inclusive&promocode=&tarifa=&mesCalendario=`

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(URL)

  //Getting de parent element of all rooms
  await page.waitForSelector('#carrinho-conteudo-pagina')
  const parent = await page.$$('#carrinho-conteudo-pagina .row-quarto')
  const arrayWithRooms = []

  //Walking for each element (room), extracting the elements, storing in an object and pushing for an array
  for (const rooms of parent) {
    const name = await page.evaluate(
      el => el.querySelector('.quartoNome').textContent,
      rooms
    )
    const description = await page.evaluate(
      el =>
        el.querySelector(
          ' td.tdQuarto > div > div.quartoContent > div > div > p'
        ).textContent,
      rooms
    )
    const price = await page.evaluate(
      el => el.querySelector('.valorFinal.valorFinalDiscounted').textContent,
      rooms
    )
    const image = await page.evaluate(
      el => el.querySelector('.room--image').getAttribute('data-src'),
      rooms
    )

    const obj = {}
    obj.name = name
    obj.description = description
    obj.price = price
    obj.image = image

    arrayWithRooms.push(obj)
  }
  await browser.close()
  return arrayWithRooms
}

//exporting the function to use in the route
exports.search = async (request, response) => {
  const checkin = request.body.checkin.split('-').reverse()
  const checkout = request.body.checkout.split('-').reverse()

  const availableHotels = await crawling(checkin, checkout)

  return response.json(availableHotels)
}