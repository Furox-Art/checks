import { expect, test } from "bun:test"
import { checkCourtyardOverlap } from "lib/check-courtyard-overlap/checkCourtyardOverlap"

test("detects overlap for pcb_courtyard_polygon", () => {
  const circuitJson: any[] = [
    {
      type: "pcb_component",
      pcb_component_id: "comp_polygon",
      center: { x: 0, y: 0 },
      layer: "top",
    },
    {
      type: "pcb_courtyard_polygon",
      pcb_courtyard_polygon_id: "poly1",
      pcb_component_id: "comp_polygon",
      layer: "top",
      points: [
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: -1, y: 1 },
      ],
    },
    {
      type: "pcb_component",
      pcb_component_id: "comp_rect",
      center: { x: 1.5, y: 0 },
      layer: "top",
    },
    {
      type: "pcb_courtyard_rect",
      pcb_courtyard_rect_id: "rect1",
      pcb_component_id: "comp_rect",
      center: { x: 1.5, y: 0 },
      width: 2,
      height: 1,
      layer: "top",
    },
  ]

  const errors = checkCourtyardOverlap(circuitJson)

  expect(errors).toHaveLength(1)
  expect(errors[0].pcb_component_ids).toEqual([
    "comp_polygon",
    "comp_rect",
  ])
})

test("detects overlap for pcb_courtyard_pill", () => {
  const circuitJson: any[] = [
    {
      type: "pcb_component",
      pcb_component_id: "comp_pill",
      center: { x: 0, y: 0 },
      layer: "top",
    },
    {
      type: "pcb_courtyard_pill",
      pcb_courtyard_pill_id: "pill1",
      pcb_component_id: "comp_pill",
      center: { x: 0, y: 0 },
      width: 4,
      height: 2,
      radius: 1,
      layer: "top",
    },
    {
      type: "pcb_component",
      pcb_component_id: "comp_rect",
      center: { x: 1.75, y: 0 },
      layer: "top",
    },
    {
      type: "pcb_courtyard_rect",
      pcb_courtyard_rect_id: "rect1",
      pcb_component_id: "comp_rect",
      center: { x: 1.75, y: 0 },
      width: 1,
      height: 1,
      layer: "top",
    },
  ]

  const errors = checkCourtyardOverlap(circuitJson)

  expect(errors).toHaveLength(1)
  expect(errors[0].pcb_component_ids).toEqual(["comp_pill", "comp_rect"])
})

test("polygon and pill courtyards still respect layers", () => {
  const circuitJson: any[] = [
    {
      type: "pcb_component",
      pcb_component_id: "comp_polygon",
      center: { x: 0, y: 0 },
      layer: "top",
    },
    {
      type: "pcb_courtyard_polygon",
      pcb_courtyard_polygon_id: "poly1",
      pcb_component_id: "comp_polygon",
      layer: "top",
      points: [
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: -1, y: 1 },
      ],
    },
    {
      type: "pcb_component",
      pcb_component_id: "comp_pill",
      center: { x: 0, y: 0 },
      layer: "bottom",
    },
    {
      type: "pcb_courtyard_pill",
      pcb_courtyard_pill_id: "pill1",
      pcb_component_id: "comp_pill",
      center: { x: 0, y: 0 },
      width: 4,
      height: 2,
      radius: 1,
      layer: "bottom",
    },
  ]

  expect(checkCourtyardOverlap(circuitJson)).toHaveLength(0)
})
