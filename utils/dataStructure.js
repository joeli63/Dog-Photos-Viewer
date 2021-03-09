let limiter = 0

export const createTree = (data, parentId = null, level = 1) => {
  const tree = []

  let index = 0

  while (data.length > 0) {
    limiter++

    if (limiter > 10000) {
      console.warn('実行回数の上限を超えました')
      break
    }

    if (data[index] === undefined) {
      if (parentId !== null) {
        break
      }

      index = 0
      continue
    }

    const item = { ...data[index] }

    if (item.parentId === parentId) {
      data.splice(index, 1)

      item.children = createTree(data, item.id, level + 1)

      if (!item.level) {
        item.level = level
      }

      tree.push(item)

      index = 0

      continue
    }

    index++
  }

  return tree
}

export const createAncestorDict = (children, ancestors = {}) => {
  return children.reduce((ancestors, node) => {
    if (Array.isArray(node.children) && node.children.length > 0) {
      createAncestorDict(node.children, ancestors)
    }

    return Object.assign(ancestors, { [node.id]: node })
  }, ancestors)
}

export const createTreeCache = (tree, cache = {}) => {
  return tree.reduce((cache, node) => {
    if (Array.isArray(node.children) && node.children.length > 0) {
      createTreeCache(node.children, cache)
      node.ancestors = createAncestorDict(node.children)
    }

    return Object.assign(cache, { [node.id]: node })
  }, cache)
}

export const createDict = (items, keyPropName = 'id') =>
  items.reduce((dict, item) => {
    return Object.assign(
      dict,
      typeof item === 'object'
        ? { [item[keyPropName]]: item }
        : { [item]: item }
    )
  }, {})

export const aggrigate = (items, groupingKey) =>
  items.reduce((group, item) => {
    const key = item[groupingKey]

    if (!group[key]) {
      group[key] = []
    }

    group[key].push(item)

    return group
  }, {})

export const createOptions = (items) =>
  items.map(({ id, name }) => ({
    code: id,
    name,
  }))

/**
 * 2階層までのツリーを作る
 * @param {Array} items
 */
export const createSecondLevelTree = (items) => {
  const groups = items.reduce((group, node) => {
    if (node.parentId) {
      return group
    }
    return Object.assign(group, { [node.id]: node })
  }, {})

  items.forEach((node) => {
    if (!node.parentId) {
      return
    }

    if (!groups[node.parentId]) {
      return
    }

    if (!Array.isArray(node[node.parentId].children)) {
      groups[node.parentId].children = []
    }

    groups[node.parentId].children.push(node)
  })

  return Object.values(groups)
}

/**
 * ツリーから要素リストを取得する
 * @param {Array} tree
 * @param {String} elementName
 */
export const getElementListFromTree = (tree, eleName) => {
  return tree.reduce((acc, o) => {
    if (o[eleName]) acc.push(o[eleName])
    if (o.children)
      acc = acc.concat(getElementListFromTree(o.children, eleName))
    return acc
  }, [])
}
