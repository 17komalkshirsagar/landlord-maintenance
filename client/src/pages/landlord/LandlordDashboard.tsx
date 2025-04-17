import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Building, Users, AlertTriangle, DollarSign } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from '../../redux/store'
import { useGetLandlordDataQuery } from "../../redux/api/Landlord.api"
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { ChartContainer } from "../../components/ui/chart"
const LandlordDashboard = () => {
    const landlord = useSelector((state: RootState) => state.auth.landlord)
    const { data, isLoading, isError } = useGetLandlordDataQuery()






    if (isLoading) return <p>Loading dashboard...</p>;
    if (isError) return <p>Something went wrong!</p>;

    const totals = data?.data?.totals;
    const chartLabels: string[] = totals ? Object.keys(totals) : [];
    const chartSeries: number[] = totals ? Object.values(totals).map(value => Number(value)) : [];

    const recent = data?.data?.recent;

    const chartOptions = {
        chart: {
            width: 300,

            type: "pie" as const,
        },
        labels: chartLabels,
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const paymentMethodCounts = recent?.payments?.reduce((acc: Record<string, number>, payment: any) => {
        acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
        return acc;
    }, {});

    const paymentChartLabels = paymentMethodCounts ? Object.keys(paymentMethodCounts) : [];
    const paymentChartSeries = paymentMethodCounts ? Object.values(paymentMethodCounts) : [];


    const tenantDateCounts = recent?.tenants?.reduce((acc: Record<string, number>, tenant: any) => {
        const date = new Date(tenant.createdAt).toLocaleDateString(); // e.g. "4/15/2025"
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const tenantDates = tenantDateCounts ? Object.keys(tenantDateCounts) : [];
    const tenantCounts = tenantDateCounts ? Object.values(tenantDateCounts) : [];


    //  maintenance
    const maintenanceByDate = recent?.maintenance?.reduce((acc: Record<string, number>, item: any) => {
        const date = new Date(item.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const areaChartDates = maintenanceByDate ? Object.keys(maintenanceByDate) : [];
    const areaChartCounts = maintenanceByDate ? Object.values(maintenanceByDate) : [];

    const areaChartOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: 350
        },
        title: {
            text: 'Maintenance Requests Over Time',
            align: 'center'
        },
        xaxis: {
            categories: areaChartDates
        },
        fill: {
            opacity: 0.3
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        }
    };

    return <>
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Hi, {landlord?.name || "Landlord"} 👋
            </h1>
        </div>
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Landlord Dashboard</h2>

            {/* Chart */}
            {totals && (
                <div className="mb-6 flex justify-center items-center">
                    <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="pie"
                        width={480}
                    />
                </div>
            )}

            {/* Property and Recent Tenants (Side by Side) */}
            {recent?.properties && recent.properties.length > 0 && tenantCounts.length > 0 && (
                <div className="flex justify-between mb-6">
                    {/* Property */}
                    <div className="w-1/2">
                        <h3 className="text-xl font-semibold mb-2 text-center">Rent Amounts by Property</h3>
                        <ReactApexChart
                            type="bar"
                            height={300}
                            series={[{
                                name: 'Rent Amount',
                                data: recent.properties.map((property: any) => property.rentAmount),
                            }]}
                            options={{
                                chart: { type: 'bar', toolbar: { show: false } },
                                xaxis: { categories: recent.properties.map((property: any) => property.name) },
                                colors: ['#3b82f6'],
                                plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '50%' } },
                                dataLabels: { enabled: false },
                                tooltip: { y: { formatter: (val: number) => `₹${val}` } },
                            }}
                        />
                    </div>

                    {/* Recent Tenants */}
                    <div className="w-1/2">
                        <h3 className="text-xl font-semibold mb-2">Tenant Signups per Day</h3>
                        <ReactApexChart
                            options={{
                                chart: { type: 'bar' },
                                xaxis: { categories: tenantDates, title: { text: 'Date' } },
                                yaxis: { title: { text: 'Number of Tenants' } },
                                dataLabels: { enabled: true },
                                tooltip: { y: { formatter: (val: number) => `${val} tenants` } }
                            }}
                            series={[{ name: 'Tenants', data: tenantCounts }]}
                            type="bar"
                            height={300}
                        />
                    </div>
                </div>
            )}

            {/* Recent Payments and Recent Maintenance (Side by Side) */}
            {paymentChartSeries.length > 0 && areaChartCounts.length > 0 && (
                <div className="flex justify-between mb-6">
                    {/* Recent Payments */}
                    <div className="w-1/2 flex justify-center items-center flex-col">
                        <h3 className="text-xl font-semibold mb-2">Payments by Method</h3>
                        <ReactApexChart
                            options={{
                                chart: { type: 'donut' },
                                labels: paymentChartLabels,
                                legend: { position: 'bottom' },
                                responsive: [{
                                    breakpoint: 480,
                                    options: { chart: { width: 200 }, legend: { position: 'bottom' } }
                                }]
                            }}
                            series={paymentChartSeries}
                            type="donut"
                            width={380}
                        />
                    </div>

                    {/* Recent Maintenance */}
                    <div className="w-1/2 p-4">
                        <h3 className="text-xl font-semibold mb-2">Maintenance Requests Over Time</h3>
                        <ReactApexChart
                            options={areaChartOptions}
                            series={[{ name: 'Requests', data: areaChartCounts }]}
                            type="area"
                            height={350}
                        />
                    </div>
                </div>
            )}
        </div>
    </>
}

export default LandlordDashboard
