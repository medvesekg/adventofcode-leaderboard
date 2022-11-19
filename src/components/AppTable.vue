<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-900 sm:rounded-lg"
        >
          <table
            class="divide-y divide-gray-200 min-w-full dark:divide-gray-900"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  v-for="(column, i) in actualColumns"
                  :key="i"
                  @click="changeOrderBy(column)"
                  scope="col"
                  :class="column.thClass"
                  :style="column.style"
                  class="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-900"
            >
              <tr
                v-for="(row, i) in actualRows"
                :style="rowStyle(row)"
                :key="i"
              >
                <td
                  v-for="(column, j) in actualColumns"
                  :key="j"
                  class="px-1 py-1 whitespace-nowrap"
                  :class="column.tdClass"
                >
                  <slot
                    :name="`column:${column.slot}`"
                    :row="row"
                    :column="column"
                    :value="getValue(row, column.accessor)"
                  >
                    {{ getValue(row, column.accessor) }}
                  </slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, orderBy, isFunction } from "lodash";

export default {
  props: {
    rows: {
      type: Array,
      required: false,
      default: null,
    },
    columns: {
      type: Array,
      required: false,
      default: null,
    },
    defaultOrderBy: {
      required: false,
      default: () => ({
        column: [],
        direction: [],
      }),
    },
    rowStyle: {
      type: Function,
      required: false,
      default: () => {},
    },
  },

  data() {
    return {
      currentOrderBy: this.defaultOrderBy,
    };
  },

  computed: {
    actualColumns() {
      if (this.columns) {
        return this.columns;
      }
      if (this.rows && this.rows.length) {
        let columns = {};
        for (let row of this.rows) {
          for (let prop in row) {
            if (!columns[prop]) {
              columns[prop] = {
                label: prop,
                accessor: prop,
                name: prop,
              };
            }
          }
        }
        return Object.values(columns);
      }

      return [];
    },

    actualRows() {
      let rows = this.rows || [];
      let columns = this.actualColumns.filter((column) => {
        return this.currentOrderBy.column.includes(column.name);
      });

      if (columns && columns.length) {
        rows = orderBy(
          rows,
          columns.map((column) => column.orderBy || column.accessor),
          this.currentOrderBy.direction
        );
      }

      return rows;
    },
  },

  methods: {
    getValue(object, accessor) {
      if (isFunction(accessor)) {
        return accessor(object);
      }
      return get(object, accessor);
    },
    changeOrderBy(column) {
      if (column.orderable === false) return;

      let oldColumn = this.currentOrderBy.column[0];
      let oldDirection = this.currentOrderBy.direction[0];

      this.currentOrderBy.column = [];
      this.currentOrderBy.direction = [];

      if (oldColumn === column.name) {
        this.currentOrderBy.column[0] = column.name;
        this.currentOrderBy.direction[0] =
          oldDirection === "asc" ? "desc" : "asc";
      } else {
        this.currentOrderBy.column[0] = column.name;
        this.currentOrderBy.direction[0] = "asc";
      }
    },
  },
};
</script>

<style></style>
