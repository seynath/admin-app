import React from 'react'
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';


const DashboardPowerBI = () => {
  return (
    <div>
      <iframe title="ecom" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=a6fe5519-cb75-46be-a31a-a9cb478555e9&autoAuth=true&ctid=aa232db2-7a78-4414-a529-33db9124cba7" frameborder="0" allowFullScreen="true"></iframe>
    </div>
  //   <div><PowerBIEmbed
  //   embedConfig = {{
  //     type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
  //     id: 'a32655ce-d664-48ca-bfd0-ad4f4a08cbee',
  //     embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=a32655ce-d664-48ca-bfd0-ad4f4a08cbee&groupId=0121d46f-fc6a-45f4-8389-18e26e4496e9&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d',
  //     accessToken: '<Access Token>',
  //     tokenType: models.TokenType.Aad, // Use models.TokenType.Aad for SaaS embed
  //     settings: {
  //       panes: {
  //         filters: {
  //           expanded: false,
  //           visible: false
  //         }
  //       },
  //       background: models.BackgroundType.Transparent,
  //     }
  //   }}
  
  //   eventHandlers = {
  //     new Map([
  //       ['loaded', function () {console.log('Report loaded');}],
  //       ['rendered', function () {console.log('Report rendered');}],
  //       ['error', function (event) {console.log(event.detail);}],
  //       ['visualClicked', () => console.log('visual clicked')],
  //       ['pageChanged', (event) => console.log(event)],
  //     ])
  //   }
  
  //   cssClassName = { "reportClass" }
  
  //   getEmbeddedComponent = { (embeddedReport) => {
  //     window.report = embeddedReport;
  //   }}
  // />
  // </div>
  )
}

export default DashboardPowerBI