import React, { useCallback, useRef } from 'react'
import { WebView } from 'react-native-webview'

import template from './template'
import { LayoutProps, PlayerEvents } from './types'

export const Vimeo: React.FC<LayoutProps> = ({
  handlers: handlersArr,
  videoId,
  videoPrivate,
  params,
  reference,
  ...otherProps
}) => {
  const webRef = useRef<WebView>()
  const url: string = params
    ? `https://player.vimeo.com/video/${videoId}?${encodeURIComponent(params)}`
    : `https://player.vimeo.com/video/${videoId}`

  const autoPlay = params?.includes('autoplay=1')

  const handlers: any = {}

  const registerHandlers = useCallback(() => {
    PlayerEvents.forEach((name) => {
      if (handlersArr) handlers[name] = handlersArr[name]
    })
  }, [handlers, handlersArr])

  registerHandlers()

  const onBridgeMessage = useCallback(
    (event: any) => {
      const payload: { name: string; data: any } = JSON.parse(
        event.nativeEvent.data
      )

      let bridgeMessageHandler = handlers[payload?.name]
      if (bridgeMessageHandler) bridgeMessageHandler(payload?.data)
    },
    [handlers]
  )

  const page: string = `<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      .loader {
        border: 12px solid #333;
        border-top: 12px solid #f3f3f3;
        border-radius: 50%;
        width: 100px;
        height: 100px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body style="position:relative;">
   <div id="container" style="position:relative;opacity:0.0;width:100%;height:100%;">
      <iframe src="${url}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
    </div>
    <div id="absolute" style="position:absolute;top:0;right:0;left:0;bottom:0;display:flex;align-items:center;justify-content:center;">
      <div class="loader"></div>
    </div>
    <script src="https://player.vimeo.com/api/player.js"></script>
  </body>
</html>`

  return (
    <WebView
      allowsFullscreenVideo={true}
      originWhitelist={['*']}
      source={{ 'html': page, 'headers': { Referer: reference } }}
      //source={{ uri: url, headers: { Referer: reference } }}
      javaScriptEnabled={true}
      ref={webRef as any}
      onMessage={onBridgeMessage}
      scrollEnabled={false}
      injectedJavaScript={template(videoId, Boolean(videoPrivate), url)}
      mediaPlaybackRequiresUserAction={!autoPlay}
      {...otherProps}
    />
  )
}
