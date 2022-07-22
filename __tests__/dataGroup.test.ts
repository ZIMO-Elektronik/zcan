import {createMX10, initConnection} from './util'
import {afterAll, beforeAll, describe, expect, it} from '@jest/globals'
import {firstValueFrom} from 'rxjs'
import {ImageType, NameType} from "../src";

describe('Data group tests - 0x07', () => {
  const mx10 = createMX10(true)

  beforeAll(async () => {
    await initConnection(mx10)
  })

  afterAll(() => {
    mx10.closeSocket()
  })

  it('0x00 - Group count test', done => {
    mx10.data.groupCount()

    const sub = mx10.data.onGroupCount.subscribe(data => {
      if (data.objectType === 0x0000) {
        expect(data.objectType).toBe(0x000)
        expect(data.number).toBeDefined()

        done()
        sub.unsubscribe()
      }
    })
  })

  it('0x01 - List item by index test', async () => {
    mx10.data.listItemsByIndex(0x0000, 3)

    const data = await firstValueFrom(mx10.data.onListItemsByIndex)

    expect(data.index).toBe(3)
    expect(data.nid).toBe(4)
  })

  it('0x02 - List item by nid test', async () => {
    mx10.data.listItemsByNID(3)

    const data = await firstValueFrom(mx10.data.onListItemsByNID)
    expect(data.nid).toBe(65535)
    expect(data.index).toBe(65535)
  })

  it('0x12 - Image config test', async () => {
    const promise = firstValueFrom(mx10.data.onItemImageConfig).then((data) => {
      expect(data.nid).toBe(3)
      expect(data.type).toBe(ImageType.VEHICLE)
      expect(data.imageId).toBe(6055)
    })

    mx10.data.itemImageConfig(3, ImageType.VEHICLE, 6055);

    return promise;
  })

  test.each<{ name: string }>([
    {name: '---'},
    {name: 'teßt Öf a näme'},
    {name: 'dodo1'},
  ])('0x21 - Data name extended test', async ({name}) => {
    mx10.data.dataNameExtended(3, 0, name)

    const data = await firstValueFrom(mx10.data.onDataNameExtended)
    expect(data.nid).toBe(3)
    expect(data.type).toBe(NameType.VEHICLE)
    expect(data.value1).toBe(undefined)
    expect(data.name).toBe(name)
  })
})
