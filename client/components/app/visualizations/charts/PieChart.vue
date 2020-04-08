<template>
  <div>
    <e-chart-visualization
      v-if="appliedOptions.series"
      widget="false"
      :height="height"
      @clicked="handleClick"
      :options="applicedOptions"
    />
    <p v-else>
      Chart is not configured, misconfigured, or data is not available
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';
import EChartVisualization from '@/components/app/visualizations/custom/EChartVisualization.vue';
import {
  VisualizationType,
  VisualizationEntity,
  PieChartConfig,
} from '@/../types/visualization-framework';
import { DataSourceEntity } from '@/../types/framework';

const baseConfig = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  series: [
    {
      type: 'pie',
      data: [
        { name: 'Apples', value: 70 },
        { name: 'Strawberries', value: 68 },
        { name: 'Bananas', value: 48 },
        { name: 'Oranges', value: 40 },
        { name: 'Pears', value: 32 },
        { name: 'Pineapples', value: 27 },
        { name: 'Grapes', value: 18 },
      ],
    },
  ],
};

@Component({
  components: {
    EChartVisualization,
  },
})
export default class PieChart extends Vue {
  @Prop() visualization!: VisualizationEntity;

  @Watch('visualization', { deep: true })
  onVisualizationChanged() {
    this.loadConfig();
  }

  @Prop({
    default: () => {
      return {};
    },
  })
  options: any;

  @Prop({ default: '640px' }) height!: string;
  @Prop({ default: '100%' }) width!: string;

  appliedOptions: any = {};
  form: any = {};

  handleClick() {}

  validateVisualization(type: VisualizationType, dataSource: any, config: any) {
    return (
      type === VisualizationType.Pie &&
      dataSource &&
      dataSource.data &&
      dataSource.data.length &&
      config
    );
  }

  // async populateChartData(options: any) {

  // }

  async loadConfig() {
    const {
      type,
      dataSource,
      config,
      title: text,
      description: subtext,
    } = this.visualization;
    if (!this.validateVisualization(type, dataSource, config)) {
      return;
    }
    const options = {
      ...baseConfig,
      ...this.options,
    };
    if (text) {
      options.title = { ...options.title, text };
    }
    if (subtext) {
      options.title = { ...options.title, subtext };
    }
    // await this.populateChartData(options)
    this.appliedOptions = options;
    console.log(this.appliedOptions);
  }

  async mounted() {
    if (this.visualization) {
      await this.loadConfig();
    }
  }
}
</script>
