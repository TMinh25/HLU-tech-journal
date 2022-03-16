// import {
//   UseColumnOrderInstanceProps,
//   UseColumnOrderState,
//   UseExpandedHooks,
//   UseExpandedInstanceProps,
//   UseExpandedOptions,
//   UseExpandedRowProps,
//   UseExpandedState,
//   UseFiltersColumnOptions,
//   UseFiltersColumnProps,
//   UseFiltersInstanceProps,
//   UseFiltersOptions,
//   UseFiltersState,
//   UseGlobalFiltersColumnOptions,
//   UseGlobalFiltersInstanceProps,
//   UseGlobalFiltersOptions,
//   UseGlobalFiltersState,
//   UseGroupByCellProps,
//   UseGroupByColumnOptions,
//   UseGroupByColumnProps,
//   UseGroupByHooks,
//   UseGroupByInstanceProps,
//   UseGroupByOptions,
//   UseGroupByRowProps,
//   UseGroupByState,
//   UsePaginationInstanceProps,
//   UsePaginationOptions,
//   UsePaginationState,
//   UseResizeColumnsColumnOptions,
//   UseResizeColumnsColumnProps,
//   UseResizeColumnsOptions,
//   UseResizeColumnsState,
//   UseRowSelectHooks,
//   UseRowSelectInstanceProps,
//   UseRowSelectOptions,
//   UseRowSelectRowProps,
//   UseRowSelectState,
//   UseRowStateCellProps,
//   UseRowStateInstanceProps,
//   UseRowStateOptions,
//   UseRowStateRowProps,
//   UseRowStateState,
//   UseSortByColumnOptions,
//   UseSortByColumnProps,
//   UseSortByHooks,
//   UseSortByInstanceProps,
//   UseSortByOptions,
//   UseSortByState,
// } from "react-table";
// import { ReactNode } from "react";

// declare module "react-table" {
//   // take this file as-is, or comment out the sections that don't apply to your plugin configuration

//   export interface TableOptions<D extends object>
//     extends UseExpandedOptions<D>,
//       UseFiltersOptions<D>,
//       UseGlobalFiltersOptions<D>,
//       UseGroupByOptions<D>,
//       UsePaginationOptions<D>,
//       UseResizeColumnsOptions<D>,
//       UseRowSelectOptions<D>,
//       UseRowStateOptions<D>,
//       UseSortByOptions<D>,
//       // note that having Record here allows you to add anything to the options, this matches the spirit of the
//       // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
//       // feature set, this is a safe default.
//       Record<string, any> {}

//   export interface Hooks<D extends object = {}>
//     extends UseExpandedHooks<D>,
//       UseGroupByHooks<D>,
//       UseRowSelectHooks<D>,
//       UseSortByHooks<D> {}

//   export interface TableInstance<D extends object = {}>
//     extends UseColumnOrderInstanceProps<D>,
//       UseExpandedInstanceProps<D>,
//       UseFiltersInstanceProps<D>,
//       UseGlobalFiltersInstanceProps<D>,
//       UseGroupByInstanceProps<D>,
//       UsePaginationInstanceProps<D>,
//       UseRowSelectInstanceProps<D>,
//       UseRowStateInstanceProps<D>,
//       UseSortByInstanceProps<D> {}

//   export interface TableState<D extends object = {}>
//     extends UseColumnOrderState<D>,
//       UseExpandedState<D>,
//       UseFiltersState<D>,
//       UseGlobalFiltersState<D>,
//       UseGroupByState<D>,
//       UsePaginationState<D>,
//       UseResizeColumnsState<D>,
//       UseRowSelectState<D>,
//       UseRowStateState<D>,
//       UseSortByState<D> {
//     hideLastRowWhenExpanding?: boolean;
//   }

//   export interface ColumnInterface<D extends object = {}>
//     extends UseFiltersColumnOptions<D>,
//       UseGlobalFiltersColumnOptions<D>,
//       UseGroupByColumnOptions<D>,
//       UseResizeColumnsColumnOptions<D>,
//       UseSortByColumnOptions<D> {
//     as?: ReactNode;
//     absoluteSorting?: boolean;
//     show?: boolean;
//     Footer?: ReactNode;
//   }

//   export interface ColumnInstance<D extends object = {}>
//     extends UseFiltersColumnProps<D>,
//       UseGroupByColumnProps<D>,
//       UseResizeColumnsColumnProps<D>,
//       UseSortByColumnProps<D> {}

//   export interface Cell<D extends object = {}, V = any>
//     extends UseGroupByCellProps<D>,
//       UseRowStateCellProps<D> {}

//   export interface Row<D extends object = {}>
//     extends UseExpandedRowProps<D>,
//       UseGroupByRowProps<D>,
//       UseRowSelectRowProps<D>,
//       UseRowStateRowProps<D> {
//     allCells: Cell<D>[];
//   }
// }

import {
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseRowStateCellProps,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateRowProps,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from "react-table";
import { ReactNode } from "react";

declare module "react-table" {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<D extends object>
    extends UseExpandedOptions<D>,
      UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      UseRowStateOptions<D>,
      UseSortByOptions<D>,
      // note that having Record here allows you to add anything to the options, this matches the spirit of the
      // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
      // feature set, this is a safe default.
      Record<string, any> {}

  export interface Hooks<D extends object = {}>
    extends UseExpandedHooks<D>,
      UseGroupByHooks<D>,
      UseRowSelectHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<D extends object = {}>
    extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseRowStateState<D>,
      UseSortByState<D> {
    hideLastRowWhenExpanding?: boolean;
  }

  export interface ColumnInterface<D extends object = {}>
    extends UseFiltersColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D> {
    as?: ReactNode;
    absoluteSorting?: boolean;
    show?: boolean;
    Footer?: ReactNode;
  }

  export interface ColumnInstance<D extends object = {}>
    extends UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Cell<D extends object = {}, V = any>
    extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  export interface Row<D extends object = {}>
    extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowSelectRowProps<D>,
      UseRowStateRowProps<D> {
    allCells: Cell<D>[];
  }
}

// import { MouseEventHandler } from "react";
// import {
//   TableInstance,
//   UseColumnOrderInstanceProps,
//   UseColumnOrderState,
//   UseExpandedHooks,
//   UseExpandedInstanceProps,
//   UseExpandedOptions,
//   UseExpandedRowProps,
//   UseExpandedState,
//   UseFiltersColumnOptions,
//   UseFiltersColumnProps,
//   UseFiltersInstanceProps,
//   UseFiltersOptions,
//   UseFiltersState,
//   UseGlobalFiltersInstanceProps,
//   UseGlobalFiltersOptions,
//   UseGlobalFiltersState,
//   UseGroupByCellProps,
//   UseGroupByColumnOptions,
//   UseGroupByColumnProps,
//   UseGroupByHooks,
//   UseGroupByInstanceProps,
//   UseGroupByOptions,
//   UseGroupByRowProps,
//   UseGroupByState,
//   UsePaginationInstanceProps,
//   UsePaginationOptions,
//   UsePaginationState,
//   UseResizeColumnsColumnOptions,
//   UseResizeColumnsColumnProps,
//   UseResizeColumnsOptions,
//   UseResizeColumnsState,
//   UseRowSelectHooks,
//   UseRowSelectInstanceProps,
//   UseRowSelectOptions,
//   UseRowSelectRowProps,
//   UseRowSelectState,
//   UseSortByColumnOptions,
//   UseSortByColumnProps,
//   UseSortByHooks,
//   UseSortByInstanceProps,
//   UseSortByOptions,
//   UseSortByState,
// } from "react-table";

// declare module "react-table" {
//   export interface UseFlexLayoutInstanceProps<
//     D extends Record<string, unknown>
//   > {
//     totalColumnsMinWidth: number;
//   }

//   export interface UseFlexLayoutColumnProps<D extends Record<string, unknown>> {
//     totalMinWidth: number;
//   }

//   export interface TableOptions<D extends Record<string, unknown>>
//     extends UseExpandedOptions<D>,
//       UseFiltersOptions<D>,
//       UseFiltersOptions<D>,
//       UseGlobalFiltersOptions<D>,
//       UseGroupByOptions<D>,
//       UsePaginationOptions<D>,
//       UseResizeColumnsOptions<D>,
//       UseRowSelectOptions<D>,
//       UseSortByOptions<D> {}

//   export interface Hooks<
//     D extends Record<string, unknown> = Record<string, unknown>
//   > extends UseExpandedHooks<D>,
//       UseGroupByHooks<D>,
//       UseRowSelectHooks<D>,
//       UseSortByHooks<D> {}

//   export interface TableInstance<
//     D extends Record<string, unknown> = Record<string, unknown>
//   > extends UseColumnOrderInstanceProps<D>,
//       UseExpandedInstanceProps<D>,
//       UseFiltersInstanceProps<D>,
//       UseGlobalFiltersInstanceProps<D>,
//       UseGroupByInstanceProps<D>,
//       UsePaginationInstanceProps<D>,
//       UseRowSelectInstanceProps<D>,
//       UseFlexLayoutInstanceProps<D>,
//       UsePaginationInstanceProps<D>,
//       UseSortByInstanceProps<D> {}

//   export interface TableState<
//     D extends Record<string, unknown> = Record<string, unknown>
//   > extends UseColumnOrderState<D>,
//       UseExpandedState<D>,
//       UseFiltersState<D>,
//       UseGlobalFiltersState<D>,
//       UseGroupByState<D>,
//       UsePaginationState<D>,
//       UseResizeColumnsState<D>,
//       UseRowSelectState<D>,
//       UseSortByState<D> {
//     rowCount: number;
//   }

//   export interface ColumnInterface<
//     D extends Record<string, unknown> = Record<string, unknown>
//   > extends UseFiltersColumnOptions<D>,
//       UseGroupByColumnOptions<D>,
//       UseResizeColumnsColumnOptions<D>,
//       UseSortByColumnOptions<D> {
//     align?: string;
//   }

//   export interface ColumnInstance<
//     D extends Record<string, unknown> = Record<string, unknown>
//   > extends UseFiltersColumnProps<D>,
//       UseGroupByColumnProps<D>,
//       UseResizeColumnsColumnProps<D>,
//       UseFlexLayoutColumnProps<D>,
//       UseSortByColumnProps<D> {}

//   export interface Cell<
//     D extends Record<string, unknown> = Record<string, unknown>
//   > extends UseGroupByCellProps<D> {}

//   export interface Row<D extends object = {}>
//     extends UseExpandedRowProps<D>,
//       UseGroupByRowProps<D>,
//       UseRowSelectRowProps<D> {}

//   export interface TableCommonProps {
//     title?: string;
//     "aria-label"?: string;
//   }

//   export interface TableSortByToggleProps {
//     title?: string;
//   }

//   export interface TableGroupByToggleProps {
//     title?: string;
//   }
// }

// export type TableMouseEventHandler = (
//   instance: TableInstance<T>
// ) => MouseEventHandler;
