<template>
    <div class="table_wrapper">
        <a-config-provider>
            <a-table
                v-if="dataSource"
                :row-key="rowKey"
                :columns="columnsSource"
                :data-source="dataSource"
                :pagination="false"
                :loading="props.loading"
                :show-sorter-tooltip="false"
                :scroll="scroll"
                :custom-row="customRow"
                @change="onTableChange"
            >
                <template #headerCell="{ column }">
                    <template v-if="isKeyInNeedCustomHeader(column.title)">
                        <slot :name="column.title" :column="column"></slot>
                    </template>
                </template>
                <template #bodyCell="{ column, record, index, text }">
                    <template v-if="isKeyInNeedCustomColumns(column.key)">
                        <slot
                            :name="column.key"
                            :column="column"
                            :record="record"
                            :text="text"
                            :index="index"
                        ></slot>
                    </template>
                </template>
            </a-table>
            <template #renderEmpty>
                <no-datas v-if="!loading && !data.length" />
            </template>
        </a-config-provider>
        <div class="thead_border_bottom"></div>
        <div
            v-if="hasData || $slots.table_bottom_status"
            class="flex justify-between pt-16 items-center bottom"
            :class="{ 'pb-16': !noPagination }"
        >
            <slot name="table_bottom_status">
                <div></div>
            </slot>
            <a-pagination
                v-if="hasData && !noPagination"
                v-model:current="pageInfo.current"
                :page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                :show-title="false"
                :disabled="props.loading"
                @change="onPageChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { TableColumnsType } from 'ant-design-vue';
    import { GetComponentProps } from 'ant-design-vue/lib/vc-table/interface';
    import type { IIbcTx } from '@/types/interface/transfers.interface';
    import type { IResponseRelayerListItem } from '@/types/interface/relayers.interface';
    import type { IResponseChannelsListItem } from '@/types/interface/channels.interface';
    import type { IResponseChainsListItem } from '@/types/interface/chains.interface';
    import type {
        IResponseIbcTokenListItem,
        ITokensListItem
    } from '@/types/interface/tokens.interface';
    import { CompareOrder } from '@/types/interface/components/table.interface';
    import { computed, onMounted, reactive, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import BigNumber from 'bignumber.js';
    import { formatLastUpdated } from '@/utils/timeTools';
    import { formatSupply } from '@/helper/tableCellHelper';
    import { useGetIbcDenoms, useTimeInterval } from '@/composables';

    const router = useRouter();
    const { ibcBaseDenoms } = useGetIbcDenoms();
    type TData =
        | IIbcTx[]
        | IResponseChainsListItem[]
        | ITokensListItem[]
        | IResponseIbcTokenListItem[]
        | IResponseRelayerListItem[]
        | IResponseChannelsListItem[];
    interface IProps {
        columns: TableColumnsType;
        data: TData;
        needCustomColumns: string[];
        needCustomHeaders?: string[];
        needCount?: boolean;
        pageSize?: number | null;
        current?: number | null;
        total?: number | null;
        noPagination?: boolean;
        scroll?: { x?: number; y?: number } | undefined;
        rowKey?: string;
        realTimeKey?: { scKey: string; dcKey: string }[] | null;
        loading: boolean;
        customRow?: GetComponentProps<any>;
    }
    let backUpDataSource: any[] = [];
    const props = withDefaults(defineProps<IProps>(), {
        pageSize: null,
        current: null,
        scroll: undefined,
        realTimeKey: null,
        rowKey: 'record_id'
    });
    const pageInfo = reactive({
        pageSize: props.pageSize || 10,
        current: props.current || 1,
        total: props.total || props.data?.length
    });
    const columnsSource = ref(props.columns);
    const dataSource = ref(props.data);
    onMounted(() => {
        backUpData();
    });
    watch(
        () => props.data,
        (_new) => {
            backUpData();
            if (needPagination.value) {
                pageInfo.total = _new?.length;
                needPagination.value && onPageChange(1, 10, false);
            }
            if (_new?.length === 0) {
                columnsSource.value = columnsSource.value.filter((item) => item.key !== '_count');
            }
        }
    );
    watch(
        () => props.total,
        (_new) => {
            pageInfo.total = _new || 0;
        }
    );
    watch(
        () => props.current,
        (_new) => {
            pageInfo.current = _new || 1;
        }
    );
    const needPagination = computed(
        () => !props.noPagination && !(props.current && props.pageSize)
    ); // 需要前端分页
    const isKeyInNeedCustomColumns = computed(
        () => (key: string) => props.needCustomColumns.includes(key)
    ); // 判断key
    const isKeyInNeedCustomHeader = computed(
        () => (key: string) => props.needCustomHeaders?.includes(key)
    );
    const hasData = computed(() => props.data?.length > 0);
    const backUpData = () => {
        const { columns, data, needCount } = props;
        if (needCount && columns.filter((item) => item.key === '_count').length === 0) {
            columns.unshift({
                dataIndex: '_count',
                key: '_count',
                title: ''
            });
            props.noPagination && (columns[0].width = 50);
        }
        backUpDataSource = data?.map((item: any, index: number) => ({
            _count: index + 1,
            ...item
        }));
        let defaultSort = props.columns.find((item) => {
            return item.defaultSortOrder != undefined;
        });
        if (defaultSort) {
            onTableChange(
                {},
                {},
                {
                    columnKey: defaultSort.key,
                    column: defaultSort,
                    order: defaultSort.defaultSortOrder
                }
            );
        } else {
            dataSource.value = formatDataSourceWithRealTime(backUpDataSource);
        }
    };
    const emits = defineEmits<{
        (e: 'onPageChange', current: number, pageSize: number): void;
    }>();
    const formatDataSourceWithRealTime = (data: any[]) => {
        if (data.length && props.realTimeKey && props.realTimeKey.length) {
            data.forEach((item: any) => {
                props.realTimeKey?.forEach((key) => {
                    item[key.dcKey] = formatLastUpdated(item[key.scKey]);
                });
            });
        }
        return data;
    };
    const onPageChange = (pageNum: number, pageSize: number, isNeedBuriedPoint = true) => {
        if (isNeedBuriedPoint) {
            (window as any).gtag('event', `${router.currentRoute.value.name as string}-点击翻页器`);
        }
        if (needPagination.value) {
            pageInfo.current = pageNum;
            pageInfo.pageSize = pageSize;
            const p = (pageNum - 1) * pageSize;
            const pSize = pageNum * pageSize;
            dataSource.value = formatDataSourceWithRealTime(backUpDataSource.slice(p, pSize));
        } else {
            emits('onPageChange', pageNum, pageSize);
        }
    };
    const formatDisplayAmount = (item: any, key: string) => {
        return formatSupply(item[key], item.base_denom, ibcBaseDenoms.value, 2, false);
    };
    let tempColumn: any;
    const onTableChange = (pagination: any, filters: any, sorter: any) => {
        let { columnKey, column, order } = sorter;
        column ? (tempColumn = column) : null;
        // 修改默认排序规则，取消 不排序的状态
        columnsSource.value.forEach((item) => {
            if (item.key === columnKey) {
                order = order || item.sortDirections?.[0] || 'ascend';
                item.sortOrder = order;
            } else {
                item.sortOrder = null;
            }
        });
        // todo duanjie => 待优化
        switch (columnKey) {
            case 'supply':
            case 'ibc_transfer_amount':
                let authedTemp: any[] = [];
                let otherTemp: any[] = [];
                backUpDataSource.forEach((item) => {
                    item.token_type === 'Authed' ? authedTemp.push(item) : otherTemp.push(item);
                });
                authedTemp = authedTemp.sort((a, b) => {
                    return (
                        new BigNumber(formatDisplayAmount(a, columnKey)).comparedTo(
                            new BigNumber(formatDisplayAmount(b, columnKey))
                        ) * (order === CompareOrder.DESCEND ? -1 : 1)
                    );
                });
                otherTemp = otherTemp.sort((a, b) => {
                    return (
                        new BigNumber(a[columnKey]).comparedTo(new BigNumber(b[columnKey])) *
                        (order === CompareOrder.DESCEND ? -1 : 1)
                    );
                });
                backUpDataSource = [...authedTemp, ...otherTemp].map(
                    (item: any, index: number) => ({
                        ...item,
                        _count: index + 1
                    })
                );
                break;
            default: // reset backup
                if (tempColumn.key !== columnKey) {
                    return;
                }
                backUpDataSource = backUpDataSource
                    .sort((a, b) => {
                        return tempColumn?.sorter(a, b) * (order === CompareOrder.DESCEND ? -1 : 1);
                    })
                    .map((item: any, index: number) => ({
                        ...item,
                        _count: index + 1
                    }));
                break;
        }
        if (props.noPagination) {
            dataSource.value = formatDataSourceWithRealTime(backUpDataSource);
        } else {
            needPagination.value && onPageChange(1, 10, false); // reset去第一页
        }
    };
    if (props.realTimeKey && props.realTimeKey.length) {
        useTimeInterval(() => {
            dataSource.value = formatDataSourceWithRealTime(dataSource.value);
        });
    }
</script>

<style lang="less" scoped>
    :deep(.ant-table) {
        overflow-x: auto;
        font-size: 14px;
    }
    :deep(.ant-table-container) {
        width: 1150px;
        min-height: 300px;
    }
    :deep(div.ant-table-body) {
        overflow-y: auto !important;
        max-height: 690px !important;
    }
    :deep(.ant-table-thead .ant-table-cell) {
        font-size: var(--bj-font-size-sub-title);
        padding: 14px 16px 14px 0;
        height: 48px;
        line-height: 1;
        background-color: #fff;
    }
    :deep(.ant-table-tbody .ant-table-cell) {
        padding-right: 35px;
        color: var(--bj-text-second);
        line-height: 1;
        vertical-align: middle;
        &:first-child {
            padding-right: 16px;
            width: 24px;
            text-align: left;
        }
    }
    :deep(.ant-table-thead > tr > th) {
        white-space: nowrap;
        border-bottom: none;
    }
    :deep(.ant-table-cell-scrollbar) {
        display: none;
    }
    :deep(.ant-table-tbody > tr > td) {
        border-bottom: 1px solid var(--bj-border-color);
        padding: 16px 16px 15px 0;
        &:only-child {
            border-bottom: none;
        }
    }
    :deep(.ant-table-cell) {
        padding-left: 0;
        white-space: nowrap;
    }
    :deep(.ant-table-thead
            > tr
            > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before) {
        width: 0;
    }
    :deep(.ant-table-column-sorter) {
        margin-left: 8px;
    }
    :deep(.ant-table-column-has-sorters) {
        cursor: pointer;
    }
    :deep(.ant-pagination li) {
        margin-bottom: 8px;
    }

    :deep(td.ant-table-column-sort) {
        background: transparent;
    }
    .table_wrapper {
        margin-top: 16px;
        padding: 0 24px;
        background-color: #fff;
        border-radius: 4px;
        position: relative;
    }
    .thead_border_bottom {
        position: absolute;
        top: 48px;
        left: 0;
        right: 0;
        background: var(--bj-border-color);
        height: 1px;
        z-index: 1;
    }
    // tablet
    @media screen and (max-width: 810px) {
        .bottom {
            display: block;
        }
        :deep(.ant-pagination) {
            margin: 8px 0;
            text-align: left;
        }
    }
    // mobile
    @media screen and (max-width: 530px) {
        .table_wrapper {
            padding: 0 16px;
        }
        .bottom {
            display: block;
        }
        :deep(.ant-pagination) {
            margin-top: 8px;
            text-align: left;
        }
    }
</style>
