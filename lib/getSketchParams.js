const lerp = (v0, v1, t) => {
  return (1 - t) * v0 + t * v1
}

export const getSingle = (sketchParams) => {
  const params = {}
  sketchParams.forEach(param => {
    if (param.min !== undefined && param.max !== undefined) {
      params[param.key] = lerp(param.min, param.max, param.value)
    } else {
      params[param.key] = param.value
    }
  })

  return params
}
